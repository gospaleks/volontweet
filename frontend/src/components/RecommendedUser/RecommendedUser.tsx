import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import type { UserRecommendation } from '@/types/user.types';

import { useToggleFollowUser } from '@/hooks/users/useToggleFollowUser';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type RecommendedUserProps = {
  user: UserRecommendation;
};

const RecommendedUser = ({ user }: RecommendedUserProps) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const { mutate, isPending } = useToggleFollowUser(user.id);

  const fullName = `${user.firstName} ${user.lastName}`;
  const avatarFallback = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  const handleFollowClick = () => {
    mutate(undefined, {
      onSuccess: (data) => {
        if (data.followed) toast.success(`You are now following ${fullName}`);
        else toast.success(`You have unfollowed ${fullName}`);
        setIsFollowing(data.followed);
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/users/${user.username}`}
        className="group flex flex-1 items-center gap-2"
      >
        <Avatar className="size-9 shrink-0">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col text-left text-sm">
          <span className="truncate font-bold underline-offset-4 group-hover:underline">
            {fullName}
          </span>
          <span className="text-muted-foreground truncate">{`@${user.username}`}</span>
        </div>
      </Link>

      {!isFollowing ? (
        <Button
          variant="secondary"
          onClick={handleFollowClick}
          disabled={isPending}
        >
          Follow
        </Button>
      ) : (
        <Button
          variant="ghost"
          onClick={handleFollowClick}
          disabled={isPending}
          className="group relative"
        >
          <span className="group-hover:hidden">Following</span>
          <span className="text-destructive hidden group-hover:inline">
            Unfollow
          </span>
        </Button>
      )}
    </div>
  );
};

export default RecommendedUser;
