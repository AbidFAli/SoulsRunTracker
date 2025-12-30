import { SortOrder } from "@/generated/graphql/graphql";
import { CaretUpFilled, CaretDownFilled } from "@ant-design/icons";
import { ICON_COLOR } from "../RunsTable/colors";


export interface SortIconProps{
  direction?: SortOrder;
  onClick?: () => void;
}
export function SortIcon(props: SortIconProps){
  return (
    <div className={`flex-col gap-y-0.5 cursor-pointer`} onClick={props.onClick}>
      <div className="h-3">
        <CaretUpFilled style={{color: props.direction === SortOrder.Asc ? ICON_COLOR.active : ICON_COLOR.inactive}}/>
      </div>
      <div>
        <CaretDownFilled style={{color: props.direction === SortOrder.Desc ? ICON_COLOR.active : ICON_COLOR.inactive}} />
      </div>

    </div>
  )
}