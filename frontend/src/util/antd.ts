import type { SortOrder as AntSortOrder } from "antd/es/table/interface";
import { SortOrder } from "@/generated/graphql/graphql";
export function convertSortOrderToGraphql(antSortOrder: AntSortOrder | undefined): SortOrder | undefined{
  if(antSortOrder === 'ascend'){
    return SortOrder.Asc
  }
  else if(antSortOrder === 'descend'){
    return SortOrder.Desc
  }
  else{
    return undefined;
  }
}