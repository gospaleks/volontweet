import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit01Icon } from '@hugeicons/core-free-icons';

import { getAvatarFallback } from '@/lib/utils';

import type { UserDetails } from '@/types/user.types';

import { useChangeAvatar } from '@/hooks/users/useChangeAvatar';
import { useAuthUser } from '@/stores/auth.store';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import ImageCropper from '@/components/ImageCropper';

type UserAvatarCropperProps = {
  user: UserDetails;
};

const UserAvatarCropper = ({ user }: UserAvatarCropperProps) => {
  const currentUser = useAuthUser();

  const { mutateAsync } = useChangeAvatar();

  const avatarFallback = getAvatarFallback(user);

  const onAvatarCropFinish = async (blob: Blob) => {
    await mutateAsync(blob);
  };

  // Other users view
  if (currentUser?.id !== user.id) {
    return (
      <Avatar className="border-background size-32 shrink-0 border-4">
        <AvatarImage
          src={user.avatarUrl}
          alt={`${user.firstName} ${user.lastName} avatar`}
        />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
    );
  }

  // Current user view
  return (
    <ImageCropper onCropFinish={onAvatarCropFinish}>
      <Avatar className="border-background relative size-32 shrink-0 border-4 hover:cursor-pointer">
        <AvatarImage
          src={user.avatarUrl}
          alt={`${user.firstName} ${user.lastName} avatar`}
        />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
        <Button size="icon-sm" className="absolute right-0 bottom-0">
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </Button>
      </Avatar>
    </ImageCropper>
  );
};

export default UserAvatarCropper;
