import { useEffect, useRef, useState, type ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, PencilEdit01Icon } from '@hugeicons/core-free-icons';

import type { UserDetails } from '@/types/user.types';

import { useAuthUser } from '@/stores/auth.store';
import { useChangeBanner } from '@/hooks/users/useChangeBanner';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';

type UserBannerProps = {
  user: UserDetails;
  children?: ReactNode;
};

const UserBanner = ({ user, children }: UserBannerProps) => {
  const currentUser = useAuthUser();
  const canEditProfile = currentUser?.id === user.id;

  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingBannerFile, setPendingBannerFile] = useState<File | null>(null);
  const [pendingBannerPreviewUrl, setPendingBannerPreviewUrl] = useState<
    string | null
  >(null);

  const { isPending: isBannerSaving, mutateAsync: saveBanner } =
    useChangeBanner();

  const bannerToShow = canEditProfile
    ? (pendingBannerPreviewUrl ?? user.bannerUrl)
    : user.bannerUrl;

  useEffect(() => {
    return () => {
      if (pendingBannerPreviewUrl) URL.revokeObjectURL(pendingBannerPreviewUrl);
    };
  }, [pendingBannerPreviewUrl]);

  const openBannerPicker = () => {
    if (!bannerInputRef.current) return;
    // Allow selecting the same file twice
    bannerInputRef.current.value = '';
    bannerInputRef.current.click();
  };

  const onBannerSelected = (file: File | null) => {
    setPendingBannerFile(file);

    setPendingBannerPreviewUrl((oldUrl) => {
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const discardPendingBanner = () => {
    setPendingBannerFile(null);
    setPendingBannerPreviewUrl((oldUrl) => {
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      return null;
    });
  };

  const onSaveBanner = async () => {
    if (!pendingBannerFile || isBannerSaving) return;

    await saveBanner(pendingBannerFile);
    discardPendingBanner();
  };

  return (
    <div className="relative">
      <div className="bg-muted/50 h-48 w-full overflow-hidden">
        {bannerToShow && (
          <img
            src={bannerToShow}
            alt={`${user.firstName} ${user.lastName} banner`}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {canEditProfile && (
        <>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onBannerSelected(e.target.files?.[0] ?? null)}
          />

          {pendingBannerFile ? (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button onClick={onSaveBanner} disabled={isBannerSaving}>
                <LoadingSwap isLoading={isBannerSaving}>Save</LoadingSwap>
              </Button>

              <Tooltip delay={400}>
                <TooltipTrigger
                  render={
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={discardPendingBanner}
                      disabled={isBannerSaving}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} />
                    </Button>
                  }
                />
                <TooltipContent>Discard changes</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <Tooltip delay={400}>
              <TooltipTrigger
                render={
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={openBannerPicker}
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} />
                  </Button>
                }
              />
              <TooltipContent>Change banner</TooltipContent>
            </Tooltip>
          )}
        </>
      )}

      {children}
    </div>
  );
};

export default UserBanner;
