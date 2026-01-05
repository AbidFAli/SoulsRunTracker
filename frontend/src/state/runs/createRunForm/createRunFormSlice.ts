import { createAppSlice } from "@/state/createAppSlice";


export interface CreateRunFormBossCompletion{
  completed: boolean;
  instanceId: string;
}
export interface CreateRunFormCycle{
  completed?: boolean;
  level?: number;
  bossesCompleted: Record<string,CreateRunFormBossCompletion>; //map BossInstance.id to BossCompletion
}
export interface CreateRunFormSavedData{
  name?: string;
  gameName?: string;
  cycles: CreateRunFormCycle[];
}

interface CreateRunFormDataActionSetCycle{
  index: number,
  cycle: CreateRunFormCycle,
}



const initialState: CreateRunFormSavedData = {
  cycles: []
}
export const createRunFormSlice = createAppSlice({
  name: "createRunForm",
  initialState,
  reducers: (create) => ({
    setAll: create.reducer<CreateRunFormSavedData>((state, action) => {
      const temp = {...action.payload, cycles: [...action.payload.cycles]};
      temp.cycles.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
      return temp;
    }),
    setCycle: create.reducer<CreateRunFormDataActionSetCycle>((state, action ) => {
      if(action.payload.index >= state.cycles.length){
        throw new Error("action.index out of range of cycles.length")
      }
      state.cycles[action.payload.index] = action.payload.cycle;
    }),
    reset: create.reducer(() => {
      return initialState;
    })
  }),
  selectors: {
    selectAll: createRunFormState => createRunFormState,
    selectCycleByLevel: (createRunFormState, cycleLevel: number) => {
      return createRunFormState.cycles.find((cycle) => cycle.level === cycleLevel)
    },
    selectGameName: (createRunFormState) => createRunFormState.gameName
  }
})

export const { setAll, setCycle, reset} = createRunFormSlice.actions;

export const { selectAll, selectCycleByLevel, selectGameName} = createRunFormSlice.selectors;