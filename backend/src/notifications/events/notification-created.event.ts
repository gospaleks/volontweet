import { NotificationType } from '../entity/notification.entity';

export class NotificationCreatedEvent {
  notificationId: string;
  userId: string; // User who RECEIVES the notification
  type: NotificationType;
  payload: Record<string, any>;
  createdAt: string;
  ui?: NotificationUiPayload;
}

export interface NotificationUiPayload {
  title: string;
  message: string;
  avatarUrl?: string;
  actionUrl?: string;
  actorId?: string;
  tweetId?: string;
}
