export const PRESENCE_ONLINE_TTL_SECONDS = 120;

export const PRESENCE_LAST_ACTIVE_ZSET_KEY = 'presence:lastActiveAt' as const;

export const PRESENCE_ONLINE_KEY_PREFIX = 'presence:online:' as const;

export function presenceOnlineKey(userId: string) {
  return `${PRESENCE_ONLINE_KEY_PREFIX}${userId}` as const;
}
