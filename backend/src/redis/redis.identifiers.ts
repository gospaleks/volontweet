// TODO: This keys and channels are just examples. Define precise keys and channels later.

export type RedisKey =
  | 'hashtags:trending'
  | 'global:online_users'
  | `user:${string}:metadata_cache`
  | `notifications:count:${string}`;

export type RedisChannel =
  | 'new_tweet'
  | `user:${string}:notifications`
  | 'system_announcement';
