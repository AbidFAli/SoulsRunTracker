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