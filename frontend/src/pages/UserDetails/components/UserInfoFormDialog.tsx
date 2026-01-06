import type { Dispatch, SetStateAction } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  userInfoSchema,
  type UserInfoSchemaType,
} from '../schema/userInfo.schema';

import type { UserDetails } from '@/types/user.types';
import { useAuthActions } from '@/stores/auth.store';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEditProfileInfo } from '@/hooks/users/useEditProfileInfo';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import FormInput from '@/components/form/FormInput';
import FormTextarea from '@/components/form/FormTextarea';
import { API_ENDPOINTS } from '@/config/endpoints';

const MAX_BIO_LENGTH = 160;

type UserInfoFormDialogProps = {
  isOpen: boolean;
  open: Dispatch<SetStateAction<boolean>>;
  user: UserDetails;
};

const UserInfoFormDialog = ({
  isOpen,
  open,
  user,
}: UserInfoFormDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio || '',
    },
  });

  const { setUser } = useAuthActions();

  const { isPending, mutate } = useEditProfileInfo();

  async function onSubmit(data: UserInfoSchemaType) {
    mutate(data, {
      onSuccess: (updatedUser) => {
        setUser(updatedUser);

        queryClient.setQueryData<UserDetails>(
          [API_ENDPOINTS.USER_DETAILS(updatedUser.username)],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName,
              bio: updatedUser.bio,
            };
          },
        );

        form.reset({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          bio: updatedUser.bio ?? '',
        });

        toast.success('Profile updated successfully!');
        open(false);
      },
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-7"
        >
          <div className="flex flex-col items-start gap-7 sm:flex-row">
            <FormInput
              control={form.control}
              name="firstName"
              label="First Name"
            />

            <FormInput
              control={form.control}
              name="lastName"
              label="Last Name"
            />
          </div>

          <FormTextarea
            control={form.control}
            name="bio"
            label="Bio"
            maxLength={MAX_BIO_LENGTH}
            placeholder="Tell us about yourself..."
          />

          <DialogFooter>
            <DialogClose
              onClick={() => form.reset()}
              render={<Button variant="ghost">Cancel</Button>}
            />
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoFormDialog;
