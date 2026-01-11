import * as graphql from '#generated/graphql/types.js';
import lodash from 'lodash';

const { isNil} = lodash;



export interface PaginationArgsCursor<T>{
  first?: number;
  after?: T;
  last?: number;
  before?: T;
}





export function validatePaginationCursorInput<T>(args: graphql.PaginationCursorInput, cursorValidator: (data: unknown) => T)
: PaginationArgsCursor<T>{
  if(!isNil(args.first) && !isNil(args.last)){
    throw new Error("do not provide both first and last as arguments to a field returning a Connection")
  }

  return {
    first: args.first ?? undefined,
    after: args.after ? cursorValidator(args.after) : undefined,
    last: args.last ?? undefined,
    before: args.before ? cursorValidator(args.before) : undefined,
  }
}