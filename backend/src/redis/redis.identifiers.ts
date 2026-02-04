export type RedisKey =
  | 'hashtags:trending'
  | `login_attempts:${string}`
  | 'users:global_online';

export type RedisChannel = 'notifications';
