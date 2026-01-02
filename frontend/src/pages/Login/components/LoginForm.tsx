import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

import FormInput from '@/components/form/FormInput';

import { loginSchema, type LoginSchemaType } from '../schema/login.schema';

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginSchemaType) {
    console.log(data);
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

        <FormInput
          control={form.control}
          name="password"
          label="Password"
          type="password"
        />

        <Button type="submit">Login</Button>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
