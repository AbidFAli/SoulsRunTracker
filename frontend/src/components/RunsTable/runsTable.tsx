"use client"
import { Row, Table, Typography, Col} from "antd"
import type { SortOrder, UserRunsFragment } from "@/generated/graphql/graphql";
import { useCallback, useContext, useMemo, useState } from "react";
import { GamesData } from "@/app/user/[userId]/runs/useGetGames";
import type { TablePaginationConfig, TableProps } from "antd";
import { CheckOutlined, DeleteFilled, EditFilled, EditOutlined} from '@ant-design/icons'
import { GAMES } from "@/util/game";
import { FilterableColumnKey, OffsetPaginationConfig, RunsTableFilters } from "./types";
import { NameColumnHeader } from "./nameColumnHeader";
import { ColumnHeader } from "./columnHeader";
import { RunTableContext, RunTableContextState } from "./context";
import { FilterIcon } from "./filterIcon";
import { SortIcon } from "./sortIcon";
import { MyRunsPageContext } from "@/app/user/[userId]/runs/context";
import lodash from 'lodash';
import { ColumnType, SorterResult } from "antd/es/table/interface";
import type { SortableColumnKey } from "./types";
import { convertSortOrderToGraphql } from "@/util/antd";
const {  Text} = Typography;



export interface RunsTableProps{
  data: UserRunsFragment[];
  gamesData: GamesData[];
  pagination: TablePaginationConfig;
  filters: RunsTableFilters;
  updateFilters: (newFilters: RunsTableFilters) => void;
  updatePagination: (newPagination: OffsetPaginationConfig) => void;
}

function getRowKey(data: UserRunsFragment){
  return data.id
}


//filterOnClose



const WIDTH_NUMBER_COL=150;
const WIDTH_GAME_COL=300
const DEFAULT_PAGE_SIZE=20;

const renderSortIcon: NonNullable<ColumnType<UserRunsFragment>['sortIcon']> =
  ({sortOrder}) => <SortIcon direction={convertSortOrderToGraphql(sortOrder)} />;

export function RunsTable(props: RunsTableProps){
  const [rowHoveredId, setRowHoveredId] = useState<string|undefined>();
  const [columnFilterOpen, setColumnFilterOpen] = useState<FilterableColumnKey>();
  const {updateSorter} = useContext(MyRunsPageContext);




  const columns = useMemo<TableProps<UserRunsFragment>['columns']>(() => {
    return [
      {
        key: 'name',
        title: <NameColumnHeader 
          filters={props.filters}
          updateFilters={props.updateFilters}
          />,
        dataIndex: 'name',
        filteredValue: props.filters.name ? [props.filters.name] : [],
      },
      {
        key: 'game',
        title: <ColumnHeader value={'Game'} />,
        render(_, record) {
          return props.gamesData.find((game) => game.id === record.gameId)?.name ?? ""
        },
        filters: Object.values(GAMES).map((gameName) => {
          return {
            text: gameName,
            value: gameName
          }
        }),
        filterIcon(filtered) {
          return <FilterIcon filtered={filtered} />
        },
        filteredValue: props.filters.game ?? [],
        filterDropdownProps: {
          onOpenChange(open) {
            setColumnFilterOpen(open ? 'game' : undefined)
          },
        },
        sorter: true,
        sortIcon: renderSortIcon,
        width: WIDTH_GAME_COL,
      },
      {
        key: 'level',
        title: <ColumnHeader value={'Level'} />,
        render(_, record) {
          return record.character?.level ?? ""
        },
        width: WIDTH_NUMBER_COL,
        filteredValue: [],
        sorter: true,
        sortIcon: renderSortIcon,
      },
      {
        key:'deaths',
        title: <ColumnHeader value={'Deaths'} />,
        dataIndex: 'deaths',
        render(value: number){
          return <Text style={{color: 'firebrick'}}>{value ?? ""}</Text>
        },
        width: WIDTH_NUMBER_COL,
        filteredValue: [],
        sorter: true,
        sortIcon: renderSortIcon,
      },
      {
        key: 'currentCycle',
        title: <ColumnHeader value={'Cycle'} />,
        dataIndex: 'currentCycle',
        render(_, record){
          return `NG+${record.currentCycle ?? 0}`
        },
        width: WIDTH_NUMBER_COL,
        filteredValue: [],

      },
      {
        key: 'completed',
        dataIndex: 'completed',
        width: WIDTH_NUMBER_COL,
        render(value, record) {
          return <Row>
            <Col span={12}>
              {value && (
                <CheckOutlined style={{color: "green"}} />
              )}
            </Col>
            <Col span={12}>
              {record.id === rowHoveredId && (
                <div className="flex justify-around">
                  <EditFilled style={{color: 'white'}} />
                  <DeleteFilled style={{color: 'white'}} />
                </div>
              )}
            </Col>
          </Row>
        },
        filters: [
          {
            text: 'Complete',
            value: true
          },
          {
            text: 'Incomplete',
            value: false,
          }
        ],
        filterIcon(filtered) {
          return <FilterIcon filtered={filtered} className="my-4" />
        },
        filterMultiple: false,
        filteredValue: props.filters.completed !== undefined ? [props.filters.completed] : [],
        filterDropdownProps: {
          onOpenChange(open) {
            setColumnFilterOpen(open ? 'completed' : undefined)
          },
        }
      },
    ]
  }, [props.gamesData, rowHoveredId, props.filters, props.updateFilters]);

  const onRow = useCallback<NonNullable<TableProps<UserRunsFragment>['onRow']>>((data) => {
    return {
      onMouseEnter: () => setRowHoveredId(data.id),
      onMouseLeave: () => setRowHoveredId(undefined)
    }
  }, [])

  const onChange = useCallback<NonNullable<TableProps<UserRunsFragment>['onChange']>>((pagination, filters, sorter) => {
    props.updatePagination({page: pagination.current ?? 1, pageSize: pagination.pageSize ?? DEFAULT_PAGE_SIZE})
    const sorterArray = Array.isArray(sorter) ?  sorter : [sorter];
    const sorterValue: SorterResult<UserRunsFragment> | undefined = sorterArray[0];


    updateSorter({
      column: sorterValue?.columnKey as SortableColumnKey,
      direction: convertSortOrderToGraphql(sorterValue?.order),
    })

    props.updateFilters({
      completed: filters['completed']?.[0] as boolean,
      game: (filters['game'] as string[]) ?? undefined,
      name: props.filters.name,
    })
    console.log('table on change executed')
  }, [props, updateSorter])

  const contextValue = useMemo<RunTableContextState>(() => {
    return {
      setColumnFilterOpen,
      columnFilterOpen
    }
  }, [columnFilterOpen])

  return (
    <RunTableContext value={contextValue}>
      <Table<UserRunsFragment>
        dataSource={props.data}
        columns={columns}
        bordered={false}
        rowKey={getRowKey}
        pagination={props.pagination}
        onRow={onRow}
        onChange={onChange}
      />
    </RunTableContext>

  )
}