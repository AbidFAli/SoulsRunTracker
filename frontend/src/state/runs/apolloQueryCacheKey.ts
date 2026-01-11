import { createAppSlice } from "@/state/createAppSlice";


//use the name of the query
export interface UserRunsPageGlobalData{
  getUserRuns: string[]
}


const initialState: UserRunsPageGlobalData = {
  getUserRuns: []
}

export const apolloQueryCacheKeySlice = createAppSlice({
  name: "apolloQueryCacheKey",
  initialState,
  reducers: (create) => ({
    addGetUserRuns: create.reducer<string>((state, action) => {
      const keySet = new Set(state.getUserRuns);
      if(!keySet.has(action.payload)){
        state.getUserRuns.push(action.payload);
      }
    }),
    resetGetUserRuns: create.reducer((state) => {
      state.getUserRuns = []
    })
  }),
  selectors: {
    selectRunsQueryCacheKeys: state => state.getUserRuns,
  }
})

export const { addGetUserRuns, resetGetUserRuns} = apolloQueryCacheKeySlice.actions;

export const { selectRunsQueryCacheKeys} = apolloQueryCacheKeySlice.selectors;