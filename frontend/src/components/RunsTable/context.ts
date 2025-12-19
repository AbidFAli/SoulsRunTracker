import { createContext } from 'react';
import { ColumnDataIndex } from './types';

export interface RunTableContextState{
  setColumnFilterOpen: (index: ColumnDataIndex | undefined)  => void;
  columnFilterOpen?: ColumnDataIndex;
}

export const RunTableContext = createContext<RunTableContextState>({
  setColumnFilterOpen: () => {},
})