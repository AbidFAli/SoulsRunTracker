import { createContext } from "react";
import type { RunsTableSorter } from "@/components/RunsTable";

export interface MyRunsPageContextType{
  updateSorter: (sorter: RunsTableSorter) => void;
}

const MyRunsPageDefaultContext: MyRunsPageContextType = {
  updateSorter: () => {},
}

export const MyRunsPageContext = createContext<MyRunsPageContextType>(MyRunsPageDefaultContext);