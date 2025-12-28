import { FormInput } from "../Form";
import type { Control } from "react-hook-form"
import { FieldPath } from "react-hook-form"


interface BaseRunFormData{
  name?: string;
}


interface RunNameInputProps<T extends BaseRunFormData>{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any, T>
}

export function RunNameInput<T extends BaseRunFormData>({control}: RunNameInputProps<T>){
  return (
    <FormInput<T>
      controllerProps={{
        name: "name" as FieldPath<T>,
        control: control,
        rules: {
          required: {value: true, message: "This field is required"}, 
          maxLength: {value: 256, message: "Max length 256 characters"}
        }
      }}
      inputProps={{
        placeholder:"Enter a name for your run"
      }}
    />
  )
}