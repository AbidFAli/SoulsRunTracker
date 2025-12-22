import { createContext } from "react";
import type { RunsTableSorter } from "@/components/RunsTable";

export interface MyRunsPageContextType{
  updateSorter: (sorter: RunsTableSorter) => void;
  loading: boolean;
}

const MyRunsPageDefaultContext: MyRunsPageContextType = {
  updateSorter: () => {},
  loading: false,
}

export const MyRunsPageContext = createContext<MyRunsPageContextType>(MyRunsPageDefaultContext);