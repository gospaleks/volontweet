import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { PresenceService } from 'src/presence/presence.service';

@Injectable()
export class UserActivityInterceptor implements NestInterceptor {
  constructor(private readonly presenceService: PresenceService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'] as JwtPayload | undefined;
    const userId = user?.sub;

    if (typeof userId === 'string' && userId.length > 0) {
      void this.presenceService.touchUserActivity(userId);
    }

    return next.handle();
  }
}
