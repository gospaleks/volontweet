import { Textarea } from '@/components/ui/textarea';

import { FormBase, type FormControlFunc } from './FormBase';

const FormTextarea: FormControlFunc = (props) => {
  return <FormBase {...props}>{(field) => <Textarea {...field} />}</FormBase>;
};

export default FormTextarea;
