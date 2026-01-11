import { Checkbox } from "antd";
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import lodash from 'lodash';


export interface FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues, 
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues>{
  
  controllerProps: Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, 'render'>;
}



export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues, 
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues>({controllerProps}: FormCheckboxProps<TFieldValues, TName, TTransformedValues>){

  return (
    <Controller
      {...controllerProps}
      render={({ field }) => (
        <Checkbox 
          {...lodash.omit(field, 'value')}
          checked={field.value}
        />
      )}
    />
  )
}