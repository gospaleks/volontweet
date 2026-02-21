import type { ReactNode } from 'react';

import { Controller } from 'react-hook-form';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  label?: ReactNode;
  description?: ReactNode;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>['control'];
};

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  horizontal?: boolean;
  controlFirst?: boolean;
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>['render']
    >[0]['field'] & {
      'aria-invalid': boolean;
      id: string;
    },
  ) => ReactNode;
};

type FormControlFunc<ExtraProps extends object = object> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> & ExtraProps,
) => ReactNode;

function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  children,
  control,
  label,
  name,
  description,
  controlFirst,
  horizontal,
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement =
          label || description ? (
            <>
              {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
            </>
          ) : null;

        const controlElement = children({
          ...field,
          id: field.name,
          'aria-invalid': fieldState.invalid,
        });

        const errorElem = fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        );

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={horizontal ? 'horizontal' : undefined}
          >
            {controlFirst ? (
              <>
                {controlElement}
                {labelElement && (
                  <FieldContent>
                    {labelElement}
                    {errorElem}
                  </FieldContent>
                )}
              </>
            ) : (
              <>
                {labelElement && <FieldContent>{labelElement}</FieldContent>}
                {controlElement}
                {errorElem}
              </>
            )}
          </Field>
        );
      }}
    />
  );
}

export type { FormBaseProps, FormControlFunc, FormControlProps };
export { FormBase };
