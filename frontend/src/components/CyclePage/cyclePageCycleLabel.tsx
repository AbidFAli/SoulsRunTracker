import { Typography } from "antd";
const { Title} = Typography;

interface CyclePageCycleLabelProps{
  cycle?: string | number | null;
}

export function CyclePageCycleLabel({cycle}: CyclePageCycleLabelProps){
  return <Title level={2} style={{marginBottom: "0px"}}>Cycle: NG+{cycle}</Title>
}