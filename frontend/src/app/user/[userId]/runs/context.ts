import { createContext } from "react";
import type { RunsTableSorter } from "@/components/RunsTable";

export interface MyRunsPageContextType{
  updateSorter: (sorter: RunsTableSorter) => void;
  sorter: RunsTableSorter;
  loading: boolean;
  userId: string;
}

const MyRunsPageDefaultContext: MyRunsPageContextType = {
  updateSorter: () => {},
  loading: false,
  sorter: {},
  userId: "",
}

export const MyRunsPageContext = createContext<MyRunsPageContextType>(MyRunsPageDefaultContext);