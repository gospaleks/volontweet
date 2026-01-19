import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum NotificationType {
  TWEET_LIKED = 'TWEET_LIKED',
  USER_FOLLOWED = 'USER_FOLLOWED',
  SYSTEM = 'SYSTEM',
}

@Entity({ name: 'notifications' })
@Index(['userId', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * User who RECEIVES the notification
   */
  @Column({ type: 'uuid' })
  userId: string;

  /**
   * Notification category / behavior
   */
  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  /**
   * Reference-only payload (JSONB)
   */
  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  /**
   * Read state
   */
  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
