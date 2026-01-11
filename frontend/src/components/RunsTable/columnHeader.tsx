import { Typography } from "antd";

const { Title} = Typography;

export interface ColumnHeaderProps{
  value: string;
}
export function ColumnHeader(props: ColumnHeaderProps){
  return (
    <Title level={3}>{props.value}</Title>
  )
}