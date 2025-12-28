"use client"
import { Row, Table, Typography, Col} from "antd"
import { useCallback, useContext, useMemo, useState } from "react";
import type { TablePaginationConfig, TableProps } from "antd";
import { ColumnType, SorterResult, TableRowSelection } from "antd/es/table/interface";
import { CheckOutlined, EditFilled} from '@ant-design/icons'
import lodash from 'lodash';
import Link from 'next/link';

import type {  UserRunsFragment } from "@/generated/graphql/graphql";
import { GamesData } from "@/app/user/[userId]/runs/useGetGames";
import { GAMES } from "@/util/game";
import { FilterableColumnKey, OffsetPaginationConfig, RunsTableFilters } from "./types";
import { NameColumnHeader } from "./nameColumnHeader";
import { ColumnHeader } from "./columnHeader";
import { RunTableContext, RunTableContextState } from "./context";
import { FilterIcon } from "./filterIcon";
import { SortIcon } from "./sortIcon";
import { MyRunsPageContext } from "@/app/user/[userId]/runs/context";
import type { RunsTableSelection} from "./types";
import { convertSortOrderToGraphql } from "@/util/antd";
import { convertAntFiltersToRunTableFilters, convertAntSorterToRunTableSorter, paginationIsEqual } from "./util";

const {  Text} = Typography;




export interface RunsTableProps{
  data: UserRunsFragment[];
  gamesData: GamesData[];
  pagination: TablePaginationConfig;
  filters: RunsTableFilters;
  updateFilters: (newFilters: RunsTableFilters) => void;
  updatePagination: (newPagination: OffsetPaginationConfig) => void;
  selection: RunsTableSelection;
  updateSelection: (newSelection: RunsTableSelection) => void;
  showSelection: boolean;
  fetchMore: (pagination: OffsetPaginationConfig) => Promise<unknown>;
}

function getRowKey(data: UserRunsFragment){
  return data.id
}






const WIDTH_NUMBER_COL=150;
const WIDTH_GAME_COL=300
const DEFAULT_PAGE_SIZE=20;

const renderSortIcon: NonNullable<ColumnType<UserRunsFragment>['sortIcon']> =
  ({sortOrder}) => <SortIcon direction={convertSortOrderToGraphql(sortOrder)} />;

export function RunsTable(
  {
    data, 
    filters,
    gamesData,
    pagination,
    selection, 
    updateFilters, 
    updatePagination, 
    updateSelection,
    showSelection,
    fetchMore
  }: RunsTableProps
){

  const [rowHoveredId, setRowHoveredId] = useState<string|undefined>();
  const [columnFilterOpen, setColumnFilterOpen] = useState<FilterableColumnKey>();
  const {updateSorter, sorter, userId} = useContext(MyRunsPageContext);




  const columns = useMemo<TableProps<UserRunsFragment>['columns']>(() => {
    return [
      {
        key: 'name',
        title: <NameColumnHeader 
          filters={filters}
          updateFilters={updateFilters}
          />,
        dataIndex: 'name',
        render(value, record) {
          return <Link href={`/user/${userId}/runs/${record.id}`}>{value}</Link>
        },
        filteredValue: filters.name ? [filters.name] : [],
      },
      {
        key: 'game',
        title: <ColumnHeader value={'Game'} />,
        render(_, record) {
          return gamesData.find((game) => game.id === record.gameId)?.name ?? ""
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
        filteredValue: filters.game ?? [],
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
                <Link href={`/user/${userId}/runs/${record.id}/edit`}>
                  <EditFilled style={{color: 'white'}} />
                </Link>
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
        filteredValue: filters.completed !== undefined ? [filters.completed] : [],
        filterDropdownProps: {
          onOpenChange(open) {
            setColumnFilterOpen(open ? 'completed' : undefined)
          },
        },
      },
    ]
  }, [
    filters, 
    updateFilters, 
    gamesData, 
    rowHoveredId,
    userId
  ]);

  const onRow = useCallback<NonNullable<TableProps<UserRunsFragment>['onRow']>>((rowData) => {
    return {
      onMouseEnter: () => setRowHoveredId(rowData.id),
      onMouseLeave: () => setRowHoveredId(undefined),
    }
  }, [])

  const onChange = useCallback<NonNullable<TableProps<UserRunsFragment>['onChange']>>((antPagination, antFilters, antSorter) => {
    if(!paginationIsEqual(pagination, antPagination)){
      const newPagination: OffsetPaginationConfig = {
        page: antPagination.current ?? 1, 
        pageSize: antPagination.pageSize ?? DEFAULT_PAGE_SIZE
      }
      fetchMore(newPagination).then(() => updatePagination(newPagination))
    }     
    const sorterArray = Array.isArray(antSorter) ?  antSorter : [antSorter];
    const sorterValue: SorterResult<UserRunsFragment> | undefined = sorterArray[0];

    const newSorter = convertAntSorterToRunTableSorter(sorterValue);
    const newFilters: RunsTableFilters = {
      ...convertAntFiltersToRunTableFilters(antFilters),
      name: filters.name, //don't change name here its controlled outside of ant table
    }

    if(!lodash.isEqual(sorter,newSorter)){
      updateSorter(newSorter)
    }

    if(!lodash.isEqual(filters, newFilters)){
      updateFilters(newFilters)
    }
    

    
  }, [
    pagination, 
    updatePagination, 
    filters, 
    sorter, 
    updateSorter, 
    updateFilters,
    fetchMore
  ])

  const contextValue = useMemo<RunTableContextState>(() => {
    return {
      setColumnFilterOpen,
      columnFilterOpen
    }
  }, [columnFilterOpen])

  const rowSelection = useMemo<TableRowSelection<UserRunsFragment>>(() => {
    const allKeys = data.map(run => run.id);
    return {
      selectedRowKeys: selection.all ? allKeys : selection.selectedRows,
      onChange(selectedRowKeys, selectedRows, info) {
        if(info.type === 'all'){
          const all = selectedRowKeys.length > 0;
          updateSelection({
            all: false,
            selectedRows: all ? allKeys : [],
          })
        }
        else{
          updateSelection({
            all: false,
            selectedRows: [...selectedRowKeys] as string[]
          })
        }
      },
      hideSelectAll: !showSelection,
      renderCell: showSelection ? undefined : () => undefined,
    }

  }, [
      data, 
      selection.all, 
      selection.selectedRows, 
      updateSelection, 
      showSelection
    ])

  return (
    <RunTableContext value={contextValue}>
        <Table<UserRunsFragment>
          dataSource={data}
          columns={columns}
          bordered={false}
          rowKey={getRowKey}
          pagination={pagination}
          onRow={onRow}
          onChange={onChange}
          rowSelection={rowSelection}
        />
    </RunTableContext>

  )
}