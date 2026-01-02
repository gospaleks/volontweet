import { useState, type InputHTMLAttributes } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { EyeIcon, EyeOff } from '@hugeicons/core-free-icons';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

import { FormBase, type FormControlFunc } from './FormBase';

type FormPasswordInputProps = InputHTMLAttributes<HTMLInputElement>;

const FormPasswordInput: FormControlFunc<FormPasswordInputProps> = ({
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormBase {...props}>
      {(field) => (
        <InputGroup>
          <InputGroupInput
            {...field}
            aria-label="Password"
            type={showPassword ? 'text' : 'password'}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              <HugeiconsIcon icon={showPassword ? EyeIcon : EyeOff} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      )}
    </FormBase>
  );
};

export default FormPasswordInput;
