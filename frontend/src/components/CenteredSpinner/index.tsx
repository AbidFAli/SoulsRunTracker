import { Spin } from "antd";

//
export function CenteredSpinner(){
  return (<Spin spinning={true} size="large" className='left-1/2 top-1/2 -translate-x-1/2  '/>)
}