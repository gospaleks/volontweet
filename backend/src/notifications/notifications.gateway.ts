import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { PresenceService } from 'src/presence/presence.service';

import { NotificationCreatedEvent } from './events/notification-created.event';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') ?? 'http://localhost:5173',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly presenceService: PresenceService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        socket.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);

      const userId = payload.sub;
      socket.data.userId = userId;

      const room = `user:${userId}`;
      socket.join(room);

      // Mark user as active + update lastActiveAt.
      await this.presenceService.markOnline(userId);

      this.logger.log(`Socket connected: ${userId}`);
    } catch (error) {
      this.logger.error(`Auth failed: ${error.message}`);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.data?.userId;
    if (userId) {
      void this.presenceService.markOffline(userId);
      this.logger.log(`Socket disconnected: ${userId}`);
    }
  }

  @SubscribeMessage('heartbeat')
  async handleHeartbeat(@ConnectedSocket() socket: Socket) {
    const userId = socket.data?.userId;
    if (typeof userId === 'string' && userId.length > 0) {
      await this.presenceService.refreshOnline(userId);
    }

    return { ok: true };
  }

  async afterInit() {
    await this.redisService.subscribe<NotificationCreatedEvent>(
      'notifications',
      (event) => {
        this.handleNotificationEvent(event);
      },
    );

    this.logger.log('Subscribed to Redis notifications channel');
  }

  private handleNotificationEvent(event: NotificationCreatedEvent) {
    const room = `user:${event.userId}`;
    this.server.to(room).emit('notification', event);
  }
}
