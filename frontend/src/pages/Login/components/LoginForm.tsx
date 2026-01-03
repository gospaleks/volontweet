import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useLoginMutation } from '@/hooks/auth/useLoginMutation';
import { useAuthActions } from '@/stores/auth.store';

import { loginSchema, type LoginSchemaType } from '../schema/login.schema';

import { FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import FormInput from '@/components/form/FormInput';
import FormPasswordInput from '@/components/form/FormPasswordInput';

const LoginForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setAccessToken, setUser } = useAuthActions();

  const { mutate, isPending } = useLoginMutation();

  async function onSubmit(data: LoginSchemaType) {
    mutate(data, {
      onSuccess: (response) => {
        setAccessToken(response.accessToken);
        setUser(response.user);

        toast.success('Login successful!');
        navigate('/');
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          placeholder="e.g. john@example.com"
        />

        <FormPasswordInput
          control={form.control}
          name="password"
          label="Password"
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : 'Login'}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
