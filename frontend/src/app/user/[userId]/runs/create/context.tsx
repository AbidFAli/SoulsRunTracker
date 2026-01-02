import React, { createContext, useMemo, useReducer } from "react";

export interface CreateRunFormBossCompletion{
  completed?: boolean;
  instanceId: string;
}
export interface CreateRunFormCycle{
  completed?: boolean;
  level?: number;
  bossesCompleted?: CreateRunFormBossCompletion[];
}
export interface CreateRunFormData{
  name?: string;
  cycles: CreateRunFormCycle[];
}

export interface CreateRunFormDataContextType{
  formData: CreateRunFormData;
  dispatch: React.ActionDispatch<[CreateRunFormDataAction]>
}


export const CreateRunFormDataContext = createContext<CreateRunFormDataContextType>({
  dispatch: () => {},
  formData: {
    cycles: []
  }
});

export type CreateRunFormDataAction = CreateRunFormDataActionSetAll | CreateRunFormDataActionSetCycle;

export interface CreateRunFormDataActionSetAll extends CreateRunFormData{
  type: 'setAll',  
}

export interface CreateRunFormDataActionSetCycle{
  type: 'setCycle',
  index: number,
  cycle: CreateRunFormCycle,
}



function createRunFormDataReducer(prevState: CreateRunFormData, action: CreateRunFormDataAction): CreateRunFormData{
  switch(action.type){
    case 'setAll': {
      return {
        cycles: action.cycles,
        name: action.name,
      }
    }
    case 'setCycle':{
      if(action.index >= prevState.cycles.length){
        throw new Error("action.index out of range of cycles.length")
      }
      const cycles = [...prevState.cycles];
      cycles[action.index] = action.cycle;
      return {
        name: prevState.name,
        cycles,
      }
    }
    default:
      throw new Error("createRunFormDataReducer action.type did not match a case");
  }
}

interface CreateRunFormContextProviderProps{
  children?: React.ReactNode;
}
export function CreateRunFormDataContextProvider({children}: CreateRunFormContextProviderProps){
  const [formData, dispatch] = useReducer(createRunFormDataReducer, {cycles: []})

  const contextValue = useMemo<CreateRunFormDataContextType>(() => {
    return {
      dispatch,
      formData
    }
  }, [formData]);

  return (
    <CreateRunFormDataContext value={contextValue}>
      {children}
    </CreateRunFormDataContext>
  )
}
