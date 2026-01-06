import { Link } from 'react-router-dom';

import type { UserRecommendation } from '@/types/user.types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import FollowButton from '@/components/FollowButton';

type RecommendedUserProps = {
  user: UserRecommendation;
  showBio?: boolean;
};

const RecommendedUser = ({ user, showBio = false }: RecommendedUserProps) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  const avatarFallback = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/users/${user.username}`}
        className="group flex flex-1 items-start gap-2"
      >
        <Avatar className="size-9 shrink-0">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col text-left text-sm">
          <span className="truncate font-semibold underline-offset-4 group-hover:underline">
            {fullName}
          </span>
          <span className="text-muted-foreground truncate">{`@${user.username}`}</span>
          {showBio && user.bio && (
            <span className="mt-2 truncate">{user.bio}</span>
          )}
        </div>
      </Link>

      <FollowButton user={user} />
    </div>
  );
};

export default RecommendedUser;
