import { SortOrder } from "@/generated/graphql/graphql"
import { RunPageListCard } from "../RunPageListCard";
import { SortIcon } from "../SortIcon";

import { useCallback, useMemo, useState } from "react";
import { Button, Col, List, Row, Space, Typography } from "antd";
import lodash from 'lodash'
import { CheckOutlined, DeleteFilled, PlusCircleOutlined } from "@ant-design/icons";

const { Item: ListItem} = List;

export interface CycleListCycle{
  id?: string;
  level: number;
  completed?: boolean;
}
export interface CycleListProps<T extends CycleListCycle = CycleListCycle>{
  cycles: T[];
  onCycleClick: (cycle: T) => void;
  editable?: boolean;
  onAddCycle?: () => void;
  onDeleteCycle?: () => void;
}


function cycleListRowKey(data: CycleListCycle){
  return data.level;
}

export function CycleList<T extends CycleListCycle = CycleListCycle>({
  cycles,
  onCycleClick,
  editable,
  onAddCycle,
  onDeleteCycle,
}: CycleListProps<T>){
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Desc);
  const [hoveredCycle, setHoveredCycle] = useState<number | undefined>();
  const sortedCycles = useMemo(() => {
    return lodash.sortBy(cycles, (cycle) => {
      const order = cycle.level;
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

  const listRenderFunction = useCallback((item: T, index: number) => {
    const lastCycle = sortOrder === SortOrder.Asc ? sortedCycles.at(-1) : sortedCycles[0];
    const isLastCycle = item.level === lastCycle?.level;

    return (
      <ListItem
        onMouseOver={() => isLastCycle && setHoveredCycle(item.level ?? undefined)}
        onMouseLeave={() => isLastCycle && setHoveredCycle(undefined)}
      >
        <Row>
          <Col span={8}>
            <Row>
              <Space>
                <Typography
                  onClick={() => onCycleClick(item)} 
                  className="cursor-pointer">
                    NG+{item.level}
                </Typography>
                {
                  item.completed && (
                    <CheckOutlined style={{color: "green"}} />
                  )
                }
              </Space>

            </Row>
          </Col>
          <Col span={8} offset={8}>
            <Row justify={"end"}>
              {
                editable && hoveredCycle===item.level && isLastCycle && (
                <DeleteFilled
                  style={{color: "white"}}
                  onClick={onDeleteCycle}
                />  
              )
            }
            </Row>
          </Col>
        </Row>
      </ListItem>
    )
  }, [onCycleClick, hoveredCycle, onDeleteCycle, editable, sortOrder, sortedCycles])

  return (
    <RunPageListCard>
      <div className="flex gap-x-4">
        <SortIcon direction={sortOrder} onClick={toggleSortOrder} />
        {
          editable && (
            <>
              <PlusCircleOutlined style={{fontSize: "24px"}} onClick={onAddCycle} />
              <Button danger={true} onClick={onDeleteCycle}>Delete Last Cycle</Button>
            </>
          )
        }
      </div>
      <List<T>
        itemLayout="vertical"
        dataSource={sortedCycles}
        rowKey={cycleListRowKey}
        renderItem={listRenderFunction}
      />
    </RunPageListCard>

  )
}