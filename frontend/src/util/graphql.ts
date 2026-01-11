import type { Unnullified } from "./types";
import lodash from 'lodash';
export interface WhereInput<T>{
  AND?: T[] | null;
  OR?: T[] | null;
  NOT?: T[] | null
}

export function mergeWhereInput<T>(wheres: WhereInput<T>[]){
  return {
    AND: wheres,
  }
}

export function unnullify<T>(data: T) : Unnullified<T>{
  const clone = lodash.cloneDeepWith(data, (preClonedData) => {
    if(preClonedData === null){
      return undefined;
    }
  })
  return clone;
}