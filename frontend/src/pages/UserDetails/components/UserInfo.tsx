import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit01Icon } from '@hugeicons/core-free-icons';

import type { UserDetails } from '@/types/user.types';

import { useAuthUser } from '@/stores/auth.store';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import H2 from '@/components/ui/typography/H2';

import FollowButton from '@/components/FollowButton';
import UserInfoFormDialog from './UserInfoFormDialog';
import { Link } from 'react-router-dom';

type UserInfoProps = {
  user: UserDetails;
};

const UserInfo = ({ user }: UserInfoProps) => {
  const currentUser = useAuthUser();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const avatarFallback = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <>
      <div className="flex flex-col">
        <div className="relative">
          <div className="bg-muted h-48 w-full overflow-hidden">
            {user.bannerUrl && (
              <img
                src={user.bannerUrl}
                alt={`${user.firstName} ${user.lastName} banner`}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Avatar className="border-background size-32 shrink-0 border-4">
              <AvatarImage
                src={user.avatarUrl}
                alt={`${user.firstName} ${user.lastName} avatar`}
              />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b p-4 pt-18">
          <div className="flex items-start justify-between gap-4">
            <div>
              <H2>{fullName}</H2>
              <div className="text-muted-foreground">@{user.username}</div>
            </div>

            {currentUser?.id === user.id ? (
              <Button onClick={() => setIsEditDialogOpen(true)}>
                <HugeiconsIcon icon={PencilEdit01Icon} />
                Edit profile
              </Button>
            ) : (
              <FollowButton
                user={user}
                isFollowing={user.stats.isFollowedByMe}
              />
            )}
          </div>

          {user.bio && <p>{user.bio}</p>}

          <div className="flex items-center gap-4 text-sm">
            <Link
              to={`/users/${user.username}/following`}
              className="group flex items-center gap-1"
            >
              <span className="font-semibold">{user.stats.followingCount}</span>
              <span className="text-muted-foreground group-hover:text-foreground underline-offset-4 group-hover:underline">
                Following
              </span>
            </Link>
            <Link
              to={`/users/${user.username}/followers`}
              className="group flex items-center gap-1"
            >
              <span className="font-semibold">{user.stats.followersCount}</span>
              <span className="text-muted-foreground group-hover:text-foreground underline-offset-4 group-hover:underline">
                Followers
              </span>
            </Link>
          </div>
        </div>
      </div>

      <UserInfoFormDialog
        isOpen={isEditDialogOpen}
        open={setIsEditDialogOpen}
        user={user}
      />
    </>
  );
};

export default UserInfo;
