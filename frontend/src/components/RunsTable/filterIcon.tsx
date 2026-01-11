import { FilterFilled } from "@ant-design/icons";
import { ICON_COLOR } from "./colors";

export interface FilterIconProps{
  filtered: boolean;
  className?: string;
}
export function FilterIcon(props: FilterIconProps){
  return (
    <div className={props.className}>
      <FilterFilled 
        style={{color: props.filtered ? ICON_COLOR.active : ICON_COLOR.inactive}}
      />
    </div>
  )


}