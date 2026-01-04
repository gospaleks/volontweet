import { useNavigate } from 'react-router-dom';

import { HugeiconsIcon } from '@hugeicons/react';
import { Logout05Icon } from '@hugeicons/core-free-icons';

import { useLogoutMutation } from '@/hooks/auth/useLogoutMutation';

import { useAuthActions } from '@/stores/auth.store';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const LogoutButton = () => {
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
    <Button
      onClick={handleLogout}
      disabled={isPending}
      variant="ghost"
      size="lg"
      className="w-full justify-start"
    >
      {isPending ? <Spinner /> : <HugeiconsIcon icon={Logout05Icon} />}
      Logout
    </Button>
  );
};

export default LogoutButton;
