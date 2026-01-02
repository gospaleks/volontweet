import type { InputHTMLAttributes } from 'react';

import { Input } from '@/components/ui/input';

import { FormBase, type FormControlFunc } from './FormBase';

type FormInputProps = InputHTMLAttributes<HTMLInputElement>;

const FormInput: FormControlFunc<FormInputProps> = ({ ...props }) => {
  return (
    <FormBase {...props}>{(field) => <Input {...field} {...props} />}</FormBase>
  );
};

export default FormInput;
