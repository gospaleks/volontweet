import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon } from '@hugeicons/core-free-icons';

import { formatRelativeDate, getUserFullName } from '@/lib/utils';

import type { UserDetails } from '@/types/user.types';

import { useAuthUser } from '@/stores/auth.store';

import FollowButton from '@/components/FollowButton';
import { Badge } from '@/components/ui/badge';

import UserAvatar from '@/components/common/UserAvatar';

type RecommendedUserProps = {
  user: UserDetails;
  showBio?: boolean;
};

const RecommendedUser = ({ user, showBio = false }: RecommendedUserProps) => {
  const currentUser = useAuthUser();

  return (
    <div className="flex items-start gap-2 border-b pb-4 md:border-none md:pb-0">
      <Link
        to={`/users/${user.username}`}
        className="group flex flex-1 items-start gap-2"
      >
        <UserAvatar user={user} />

        <div className="flex min-w-0 flex-1 flex-col text-left text-sm">
          <span className="truncate font-semibold underline-offset-4 group-hover:underline">
            {getUserFullName(user)}
          </span>
          <span className="text-muted-foreground truncate">{`@${user.username}`}</span>
          {showBio && user.bio && (
            <span className="mt-2 wrap-break-word">{user.bio}</span>
          )}

          {user.lastActiveAt && !user.isActive && (
            <Badge variant="outline" className="mt-1">
              <HugeiconsIcon icon={Clock01Icon} />
              Active {formatRelativeDate(user.lastActiveAt)}
            </Badge>
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
