import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

import FormInput from '@/components/form/FormInput';

import {
  registerSchema,
  type RegisterSchemaType,
} from '../schema/register.schema';

const RegisterForm = () => {
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

  async function onSubmit(data: RegisterSchemaType) {
    console.log(data);
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

        <FormInput
          control={form.control}
          name="password"
          label="Password"
          type="password"
        />

        <Button type="submit">Register</Button>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
