import { useNavigate } from 'react-router-dom';

import { HugeiconsIcon } from '@hugeicons/react';
import { Logout05Icon } from '@hugeicons/core-free-icons';

import { useLogoutMutation } from '@/hooks/auth/useLogoutMutation';

import { useAuthActions } from '@/stores/auth.store';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';

const LogoutDropdownItem = () => {
  const navigate = useNavigate();

  const { logout } = useAuthActions();

  const { mutate, isPending } = useLogoutMutation();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        logout();
        navigate('/login', { replace: true });
      },
    });
  };

  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? <Spinner /> : <HugeiconsIcon icon={Logout05Icon} />}
      Logout
    </DropdownMenuItem>
  );
};

export default LogoutDropdownItem;
