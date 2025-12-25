import type { ActionDispatch } from 'react';
import React, { createContext, useMemo, useReducer } from 'react';

export interface AppContextState{
  userId?: string;
  dispatch: ActionDispatch<[AppContextAction]>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function dummyDispatch(_: AppContextAction){
  throw new Error("AppContext.dispatch has not been set")
}

export const AppContext = createContext<AppContextState>({
  dispatch: dummyDispatch,
});

type AppContextAction = AppContextActionSetUser;

interface AppContextActionSetUserData{
  userId?: string;
}

interface AppContextActionSetUser{
  type: 'setUser';
  data: AppContextActionSetUserData;
}


export function appContextReducer(state: AppContextState, action:AppContextAction): AppContextState{
  switch(action.type){
    case 'setUser':{
      return { userId: action.data.userId, dispatch: state.dispatch}
    }
  }
}

interface AppContextProviderProps{
  children: React.ReactNode
}

const appContextInitialValue: AppContextState = {
  dispatch: dummyDispatch,
};

export function AppContextProvider(props: AppContextProviderProps){
    const [appContextState, dispatch] = useReducer(appContextReducer, appContextInitialValue);
    const appContextStateWithDispatch = useMemo<AppContextState>(() => {
      return {
        ...appContextState,
        dispatch,
      }
    }, [appContextState])

    return ( 
      <AppContext value={appContextStateWithDispatch}>
        {props.children}
      </AppContext>
    );
}