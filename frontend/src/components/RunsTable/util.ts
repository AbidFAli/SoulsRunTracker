"use client"
import type {  UserRunsFragment } from "@/generated/graphql/graphql";
import type { TablePaginationConfig } from "antd";
import {  RunsTableFilters } from "./types";
import lodash from 'lodash';
import { FilterValue, SorterResult } from "antd/es/table/interface";
import type {  RunsTableSorter, SortableColumnKey } from "./types";
import { convertSortOrderToGraphql } from "@/util/antd";



export function convertAntSorterToRunTableSorter(antSorter: SorterResult<UserRunsFragment> | undefined): RunsTableSorter{
  return {
      column: antSorter?.columnKey as SortableColumnKey,
      direction: convertSortOrderToGraphql(antSorter?.order),
    }
}

export function convertAntFiltersToRunTableFilters(antFilters: Record<string, FilterValue | null>): RunsTableFilters{
  return {
      completed: antFilters['completed']?.[0] as boolean,
      game: (antFilters['game'] as string[]) ?? undefined,  
  }
}

export function paginationIsEqual(oldPagination: TablePaginationConfig, newPagination: TablePaginationConfig){
  const oldSlice = lodash.pick(oldPagination, ['pageSize', 'current'] );
  const newSlice = lodash.pick(newPagination, ['pageSize', 'current']);
  return lodash.isEqual(oldSlice, newSlice);
}