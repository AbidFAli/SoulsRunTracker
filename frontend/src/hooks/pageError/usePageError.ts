import type { ErrorLike } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  LocalStateError,
  ServerError,
  ServerParseError,
  UnconventionalError,

} from "@apollo/client/errors";

import { PageErrorMessengerContextType } from './context';




interface UsePageErrorProps{
  error?: ErrorLike;
}



export function usePageError({error: pageError} : UsePageErrorProps){


  
  const handleGraphqlError = useCallback((error?: ErrorLike) => {
    if (CombinedGraphQLErrors.is(error)) {
      return "There was an error when sending your request to the server"
      
    } else if (
        CombinedProtocolErrors.is(error)
        || LocalStateError.is(error)
        || ServerError.is(error)
        || ServerParseError.is(error)
        || UnconventionalError.is(error)
    )
    {
      return "There was a network error"
    } else if(error !== undefined){
      return "Unknown error when sending your request to the server"
    }
    else{
      return undefined
    }
  }, [])





  const context = useMemo<PageErrorMessengerContextType>(() => {
    return {
      errorText: handleGraphqlError(pageError)
    }
  }, [handleGraphqlError, pageError]);


  return {
    context
  }

} 