import { Checkbox } from '@/components/ui/checkbox';

import { FormBase, type FormControlFunc } from './FormBase';

const FormCheckbox: FormControlFunc = (props) => {
  return (
    <FormBase {...props} horizontal controlFirst>
      {({ onChange, value, ...field }) => (
        <Checkbox {...field} checked={value} onCheckedChange={onChange} />
      )}
    </FormBase>
  );
};

export default FormCheckbox;
