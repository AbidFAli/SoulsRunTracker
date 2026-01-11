import type { SortOrder } from "@/generated/graphql/graphql";
export interface RunsTableFilters{
  name?: string;
  game?: string[],
  completed?: boolean;
}

export type FilterableColumnKey = 'name' | 'game' | 'completed';
export type SortableColumnKey = 'game' | 'level' | 'deaths';

export interface OffsetPaginationConfig{
  page: number;
  pageSize: number;
}

export interface RunsTableSorter{
  column?: SortableColumnKey;
  direction?: SortOrder;
}

export interface RunsTableSelection{
  selectedRows: string[];
  all: boolean;
}