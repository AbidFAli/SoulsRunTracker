import { createContext } from "react";



export interface PageErrorMessengerContextType{
  errorText?: string;
}

export const PageErrorMessengerContext = createContext<PageErrorMessengerContextType>({
})

