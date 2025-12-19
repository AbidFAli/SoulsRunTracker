import { FilterFilled } from "@ant-design/icons";
import { FILTER_COLOR } from "./colors";

export interface FilterIconProps{
  filtered: boolean;
}
export function FilterIcon(props: FilterIconProps){
  return <FilterFilled 
    style={{color: props.filtered ? FILTER_COLOR.active : FILTER_COLOR.inactive}}
  />
}