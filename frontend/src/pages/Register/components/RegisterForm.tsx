import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useRegisterMutation } from '@/hooks/auth/useRegisterMutation';

import {
  registerSchema,
  type RegisterSchemaType,
} from '../schema/register.schema';

import { FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

import FormInput from '@/components/form/FormInput';
import FormPasswordInput from '@/components/form/FormPasswordInput';
import { Spinner } from '@/components/ui/spinner';

const RegisterForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useRegisterMutation();

  function onSubmit(data: RegisterSchemaType) {
    mutate(data, {
      onSuccess: () => {
        navigate('/login');
        toast.success('Registration successful! Please log in.');
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2 sm:gap-4">
          <FormInput
            control={form.control}
            name="firstName"
            label="First Name"
            placeholder="e.g. John"
          />

          <FormInput
            control={form.control}
            name="lastName"
            label="Last Name"
            placeholder="e.g. Doe"
          />
        </div>

        <FormInput
          control={form.control}
          name="username"
          label="Username"
          placeholder="e.g. john_doe"
        />

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
          {isPending ? <Spinner /> : 'Register'}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
