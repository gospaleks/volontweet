import { Link } from 'react-router-dom';

import { getAvatarFallback, getUserFullName } from '@/lib/utils';

import type { UserDetails } from '@/types/user.types';

import { useAuthUser } from '@/stores/auth.store';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import FollowButton from '@/components/FollowButton';

type RecommendedUserProps = {
  user: UserDetails;
  showBio?: boolean;
};

const RecommendedUser = ({ user, showBio = false }: RecommendedUserProps) => {
  const currentUser = useAuthUser();

  return (
    <div className="flex items-start gap-2">
      <Link
        to={`/users/${user.username}`}
        className="group flex flex-1 items-start gap-2"
      >
        <Avatar className="size-9 shrink-0">
          <AvatarImage
            src={user.avatarUrl}
            alt={`${getUserFullName(user)} avatar`}
          />
          <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col text-left text-sm">
          <span className="truncate font-semibold underline-offset-4 group-hover:underline">
            {getUserFullName(user)}
          </span>
          <span className="text-muted-foreground truncate">{`@${user.username}`}</span>
          {showBio && user.bio && (
            <span className="mt-2 wrap-break-word">{user.bio}</span>
          )}
        </div>
      </Link>

      {currentUser?.id !== user.id && (
        <FollowButton user={user} isFollowing={user.stats.isFollowedByMe} />
      )}
    </div>
  );
};

export default RecommendedUser;
