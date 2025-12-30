import { SortOrder, type RunPageCycleFragment } from "@/generated/graphql/graphql"
import { RunPageListCard } from "../RunPageListCard";

import { useCallback, useMemo, useState } from "react";
import { Card, List, Typography } from "antd";
import lodash from 'lodash'
import { SortIcon } from "../SortIcon";

const { Item: ListItem} = List;

export interface CycleListProps{
  cycles: RunPageCycleFragment[];
  onCycleClick: (cycle: RunPageCycleFragment) => void;
}


function cycleListRowKey(data: RunPageCycleFragment){
  return data.id;
}
export function CycleList({
  cycles,
  onCycleClick
}: CycleListProps){
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Desc);
  const sortedCycles = useMemo(() => {
    return lodash.sortBy(cycles, (cycle) => {
      const order = cycle.level ?? 0;
      if(sortOrder === SortOrder.Asc){
        return order;
      }
      else{
        return -1 * order;
      }
    })
  }, [cycles, sortOrder])

  const toggleSortOrder = useCallback(() => {
    if(sortOrder === SortOrder.Asc){
      setSortOrder(SortOrder.Desc);
    }
    else{
      setSortOrder(SortOrder.Asc);
    }
  }, [sortOrder]);

  const listRenderFunction = useCallback((item: RunPageCycleFragment) => {
    return (
      <ListItem onClick={() => onCycleClick(item)}>
        <Typography>NG+{item.level}</Typography>
      </ListItem>
    )
  }, [onCycleClick])

  return (
    <RunPageListCard>
      <div className="flex">
        <SortIcon direction={sortOrder} onClick={toggleSortOrder} />
      </div>
      <List
        dataSource={sortedCycles}
        rowKey={cycleListRowKey}
        renderItem={listRenderFunction}
      />
    </RunPageListCard>

  )
}