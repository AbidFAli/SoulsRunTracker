import { createContext } from 'react';
import { FilterableColumnKey } from './types';

export interface RunTableContextState{
  setColumnFilterOpen: (index: FilterableColumnKey | undefined)  => void;
  columnFilterOpen?: FilterableColumnKey;
}

export const RunTableContext = createContext<RunTableContextState>({
  setColumnFilterOpen: () => {},
})