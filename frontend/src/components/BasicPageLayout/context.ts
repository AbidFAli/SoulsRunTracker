import { createContext } from "react";
import type { ErrorLike } from '@apollo/client';
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  LocalStateError,
  ServerError,
  ServerParseError,
  UnconventionalError,

} from "@apollo/client/errors";


export interface BasicPageLayoutContextType{
  error?: ErrorLike;
  setError: (error?: ErrorLike) => void;
  handleGraphqlError: (error?: ErrorLike) => void;
}

export const BasicPageLayoutContext = createContext<BasicPageLayoutContextType>({
  setError: () => {},
  handleGraphqlError: () => {},
})

export function handleGraphqlError(error: ErrorLike, setError: (error?: ErrorLike) => void){
  if (CombinedGraphQLErrors.is(error)) {
    setError({
      message: "There was an error when sending your request to the server",
      name: "UnknownError"
    })

  } else if (
      CombinedProtocolErrors.is(error)
      || LocalStateError.is(error)
      || ServerError.is(error)
      || ServerParseError.is(error)
      || UnconventionalError.is(error)
  )
  {
    setError({
      message: "There was a network error",
      name: "NetworkError",
    })

  } else {
    setError({
      message: "Unknown error when sending your request to the server",
      name: "UnknownError"
    })

  }
}