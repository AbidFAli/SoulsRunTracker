import { CheckOutlined } from "@ant-design/icons";

interface RunCompletedIconProps{
  className?: string;
}

export function RunCompletedIcon({className}: RunCompletedIconProps){
  return <CheckOutlined className={className} style={{color: "green"}} />
}