import { useState } from 'react';
import { toast } from 'sonner';

import type { AuthUser } from '@/stores/auth.store';

import { useToggleFollowUser } from '@/hooks/users/useToggleFollowUser';

import { Button } from '@/components/ui/button';

type Props = {
  user: AuthUser;
  isFollowing?: boolean;
};

const FollowButton = ({ user, isFollowing = false }: Props) => {
  const [isFollowingState, setIsFollowing] = useState(isFollowing);

  const { mutate, isPending } = useToggleFollowUser(user.id);

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleFollowClick = () => {
    mutate(undefined, {
      onSuccess: (data) => {
        if (data.followed) toast.success(`You are now following ${fullName}`);
        else toast.success(`You have unfollowed ${fullName}`);
        setIsFollowing(data.followed);
      },
    });
  };

  if (!isFollowingState) {
    return (
      <Button
        variant="secondary"
        onClick={handleFollowClick}
        disabled={isPending}
      >
        Follow
      </Button>
    );
  } else {
    return (
      <Button
        variant="ghost"
        onClick={handleFollowClick}
        disabled={isPending}
        className="group relative"
      >
        <span className="text-primary group-hover:hidden">Following</span>
        <span className="text-destructive hidden group-hover:inline">
          Unfollow
        </span>
      </Button>
    );
  }
};

export default FollowButton;
