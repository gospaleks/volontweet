import { Input } from '@/components/ui/input';

import { FormBase, type FormControlFunc } from './FormBase';

const FormInput: FormControlFunc = (props) => {
  return <FormBase {...props}>{(field) => <Input {...field} />}</FormBase>;
};

export default FormInput;
