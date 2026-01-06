import { createAppSlice } from "@/state/createAppSlice";


export interface UserRunsPageGlobalData{
  runsQueryCacheKeys: string[]
}


const initialState: UserRunsPageGlobalData = {
  runsQueryCacheKeys: []
}

export const userRunsPageGlobalDataSlice = createAppSlice({
  name: "userRunsPageGlobalData",
  initialState,
  reducers: (create) => ({
    addRunsQueryCacheKey: create.reducer<string>((state, action) => {
      const keySet = new Set(state.runsQueryCacheKeys);
      if(!keySet.has(action.payload)){
        state.runsQueryCacheKeys.push(action.payload);
      }
    }),
    reset: create.reducer(() => {
      return initialState;
    })
  }),
  selectors: {
    selectRunsQueryCacheKeys: state => state.runsQueryCacheKeys,
  }
})

export const { addRunsQueryCacheKey, reset} = userRunsPageGlobalDataSlice.actions;

export const { selectRunsQueryCacheKeys} = userRunsPageGlobalDataSlice.selectors;