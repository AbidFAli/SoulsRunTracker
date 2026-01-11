import { createAppSlice } from "@/state/createAppSlice";
import type { EditRunFormData, EditRunFormCycle, EditRunFormBossCompletion } from "@/app/user/[userId]/runs/[runId]/edit/types";


export interface EditRunFormGlobalData extends Omit<EditRunFormData, "cycles">{
  gameName?: string;
  cycles: string[];
  createdCycles: Record<string, EditRunFormGlobalDataCreateCycle>; //store the createdCycles
  editedCycles: Record<string, EditRunFormGlobalDataEditCycle>; //store a delta of what was changed on a Cycle
}

type EditRunFormGlobalDataCreateCycle = Required<EditRunFormCycle>;

//TODO re-introduce level here. Change to {...fields, delta: {completed, bossesCompleted}}.
// This way you can eagerly show the level when you switch pages.
export interface EditRunFormGlobalDataEditCycle{
  id: string;
  completed?: boolean;
  bossesCompleted: Record<string, EditRunFormBossCompletion>; //map BossInstance.id to BossCompletion
}



const initialState: EditRunFormGlobalData = {
  id: "",
  cycles: [],
  createdCycles: {},
  editedCycles: {},
}


export const editRunFormSlice = createAppSlice({
  name: "editRunForm",
  initialState,
  reducers: (create) => ({
    setAll: create.reducer<EditRunFormGlobalData>((state, action) => {
      return action.payload;
    }),
    setCreatedCycle: create.reducer<EditRunFormGlobalDataCreateCycle>((state, action ) => {
      state.createdCycles[action.payload.id] = action.payload;
    }),
    setEditedCycle: create.reducer<EditRunFormGlobalDataEditCycle>((state, action) => {
      state.editedCycles[action.payload.id] = action.payload;
    }),
    unsetEditedCycle: create.reducer<string>((state, action) => {
      delete state.editedCycles[action.payload];
    }),
    reset: create.reducer(() => {
      return initialState;
    })
  }),
  selectors: {
    selectAll: state => state,
    selectCreatedCycle: (state, id: string): EditRunFormGlobalDataCreateCycle | undefined => {
      return state.createdCycles[id];
    },
    selectedEditedCycle: (state, id: string): EditRunFormGlobalDataEditCycle | undefined => {
      return state.editedCycles[id];
    },
    selectGameName: (state) => state.gameName
  }
})

export const { setAll, setCreatedCycle, setEditedCycle, unsetEditedCycle, reset} = editRunFormSlice.actions;

export const { selectAll, selectCreatedCycle, selectedEditedCycle, selectGameName} = editRunFormSlice.selectors;
