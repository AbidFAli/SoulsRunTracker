import type { Resolver } from '#generated/graphql/types.js';

export type ContextType = Record<string, unknown>;
 
export type Resolvers = Record<string, ResolversObject>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResolversObject = Record<string, Resolver<any, any, ContextType, any>>;