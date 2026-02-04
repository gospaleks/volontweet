import { cn, getAvatarFallback, getUserFullName } from '@/lib/utils';

import type { AuthUser } from '@/stores/auth.store';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type UserAvatarProps = {
  user: AuthUser;
  avatarSize?: string;
  onlineStatusSize?: string;
  online?: boolean;
  className?: string;
};

const UserAvatar = ({
  user,
  avatarSize = 'size-9',
  onlineStatusSize = 'size-2',
  online,
  className,
}: UserAvatarProps) => {
  return (
    <Avatar className={cn('relative shrink-0', avatarSize, className)}>
      <AvatarImage
        src={user.avatarUrl}
        alt={`${getUserFullName(user)} avatar`}
      />
      <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
      {user.isActive || online ? (
        <span
          className={cn(
            'ring-background bg-primary absolute right-0 bottom-0 z-1 rounded-full ring-2',
            onlineStatusSize,
          )}
        />
      ) : (
        <span
          className={cn(
            'ring-background bg-muted absolute right-0 bottom-0 z-1 rounded-full ring-2',
            onlineStatusSize,
          )}
        />
      )}
    </Avatar>
  );
};

export default UserAvatar;
