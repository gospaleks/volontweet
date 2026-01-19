export type RedisKey =
  | 'hashtags:trending'
  | `login_attempts:${string}`
  | 'global:online_users';

export type RedisChannel = 'notifications' | 'system_announcement';
