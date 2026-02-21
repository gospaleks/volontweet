import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';

import { FormBase, type FormControlFunc } from './FormBase';

const FormTextarea: FormControlFunc<React.ComponentProps<'textarea'>> = ({
  maxLength = 200,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <InputGroup>
          <InputGroupTextarea
            {...field}
            {...props}
            value={field.value ?? ''}
            maxLength={maxLength}
          />
          <InputGroupAddon align="block-end">
            <InputGroupText className="text-muted-foreground text-xs">
              {field.value?.length}/{maxLength}
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      )}
    </FormBase>
  );
};

export default FormTextarea;
