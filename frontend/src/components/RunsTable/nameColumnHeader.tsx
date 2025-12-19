"use client"
import { Input, Space, Button, theme } from "antd"
import React, { useCallback, useMemo, useRef, useState, useContext } from "react";
import { RunTableContext} from './context'
import { SearchOutlined} from '@ant-design/icons'
import { RunsTableFilters } from "./types";
import { ColumnHeader } from "./columnHeader";
import { useOnClickOutside } from "usehooks-ts";
import { FILTER_COLOR } from "./colors";

const { useToken} = theme;




interface NameColumnHeaderProps{
  filters: RunsTableFilters;
  updateFilters: (newFilters: RunsTableFilters) => void;
}



export function NameColumnHeader(props: NameColumnHeaderProps){
  const {token} = useToken();
  const runTableContext = useContext(RunTableContext);


  const closeDropdown = useCallback(() => {
    runTableContext.setColumnFilterOpen(undefined);
  }, [runTableContext])


  const filtered = useMemo<boolean>(() => {
    return props.filters.name !== undefined
  }, [props.filters.name])

  const onSearchClick = useCallback(() => {
    runTableContext.setColumnFilterOpen('name')
  }, [runTableContext])



  return (
    <div className="relative">
      <div className="flex w-full">
        <ColumnHeader value={'Name'} />
        <div className="flex justify-end grow">
          <SearchOutlined 
            style={{color: filtered ? FILTER_COLOR.active : FILTER_COLOR.inactive}}
            onClick={onSearchClick}
          />
        </div>
      </div>
      {runTableContext.columnFilterOpen === 'name' && (
        <div className="absolute z-50 rounded-md" style={{backgroundColor: token.Table?.filterDropdownMenuBg}}>
          <NameFilterDropdown 
            closeDropdown={closeDropdown}
            filters={props.filters}
            updateFilters={props.updateFilters}
          />
        </div>
      )}
    </div>

  )
}


interface NameFilterDropdownProps{
    filters: RunsTableFilters;
    updateFilters: (newFilters: RunsTableFilters) => void;
    closeDropdown: () => void
}

interface NameFilterDropdownConfirmArgs{
  closeDropdown?: boolean
}
function NameFilterDropdown(props: NameFilterDropdownProps){
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const ref = useRef<HTMLDivElement>(null);

  const onClickOutsideFilterDropdown = useCallback(() => {
    props.closeDropdown()
  }, [props])

  useOnClickOutside(ref as React.RefObject<HTMLDivElement>, onClickOutsideFilterDropdown)

  const handleReset = useCallback(() => {
    setSearchValue(undefined)
  }, []);

  //set 
  const confirm = useCallback((args?: NameFilterDropdownConfirmArgs) => {
    if(args?.closeDropdown === true || args?.closeDropdown === undefined){
      props.closeDropdown()
    }
    props.updateFilters({
      ...props.filters,
      name: searchValue
    })
  }, [props, searchValue])


  return (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()} ref={ref}>
        <Input
          placeholder={`Search name`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({closeDropdown: false})
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              props.closeDropdown()
            }}
          >
            Close
          </Button>
        </Space>
      </div>
  )
}