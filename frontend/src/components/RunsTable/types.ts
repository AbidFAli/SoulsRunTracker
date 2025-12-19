export interface RunsTableFilters{
  name?: string;
  game?: string[],
  completed?: boolean;
}

export type ColumnDataIndex = 'name' | 'game' | 'completed';
