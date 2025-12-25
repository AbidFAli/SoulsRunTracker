import { Alert, AlertProps, Col, Input, InputProps, Row } from "antd"
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form"


interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues, 
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues>{
  
  controllerProps: Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, 'render'>;
  inputProps?: InputProps;
  alertProps?: AlertProps;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues, 
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues>(props: FormInputProps<TFieldValues, TName, TTransformedValues>){
    return (
    <Controller 
          {...props.controllerProps}
          render={({field, formState, fieldState}) => {
            return(
              <Row gutter={'20px'} align={"middle"}>
                <Col span={12}>
                  <Input {...field}
                    {...props.inputProps}
                    status={fieldState.error ? 'error' : undefined}
                    size="middle"
                    className="border-white"/>
                </Col>
                <Col span={12}>
                  {
                    fieldState.error && (
                      <Alert
                        {...props.alertProps}
                        className="w-52"
                        title={fieldState.error.message}
                        type="error"
                      />
                    )
                  }
                </Col>
              </Row>
            )
          }} 
        />
  )


}