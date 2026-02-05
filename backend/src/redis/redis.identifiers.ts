export type RedisKey =
  | 'hashtags:trending'
  | `login_attempts:${string}`
  | 'presence:lastActiveAt'
  | `presence:online:${string}`;

export type RedisChannel = 'notifications';
