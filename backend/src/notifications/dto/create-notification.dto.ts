import { NotificationType } from '../entity/notification.entity';

export class CreateNotificationDto {
  userId: string; // User who RECEIVES the notification
  type: NotificationType;
  payload: Record<string, any>;
}
