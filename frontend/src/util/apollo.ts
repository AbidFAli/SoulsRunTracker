import { ApolloClient, FieldFunctionOptions, HttpLink, InMemoryCache } from "@apollo/client";
import type { RunConnection, GetUserRunsQueryVariables, QueryRunsArgs } from "@/generated/graphql/graphql";
import lodash from 'lodash';


type RunsQueryFieldFunctionOptions = FieldFunctionOptions<Partial<GetUserRunsQueryVariables>, Partial<GetUserRunsQueryVariables>>
export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:8000/api/graphql' }),
  cache: new InMemoryCache(
    {
      typePolicies: {
        Query: {
          fields: {
            runs: {
              keyArgs(args, context){
                //return "runs:${JSON.stringify(args)}"
                if(args === null){
                  return context.fieldName;
                }
                const queryRunsArgs = args as QueryRunsArgs;
                const picked = {
                  orderBy: queryRunsArgs.orderBy,
                  where: queryRunsArgs.where,
                  pagination: queryRunsArgs.pagination.cursor ? "cursor" : "offset"
                };

                //i could forsee some issues with null, field orderings
                return `runs:${JSON.stringify(picked)}`
              },
              merge(existing: RunConnection | undefined, incoming: RunConnection, options: RunsQueryFieldFunctionOptions): RunConnection{
                //hopefully incoming is not undefined, if it is this will break
                const merged: RunConnection = {
                  pageInfo: incoming.pageInfo,
                  __typename: "RunConnection",
                }
                const mergedEdges = existing?.edges?.slice(0) ?? []
                const incomingEdges = incoming.edges ?? [];

                const offset = options.args?.pagination?.offset?.skip ?? 0;
                if(existing && lodash.isNil(options.args?.pagination?.offset?.skip)){
                  throw new Error("field policy for non paginated and cursor based pagination on runs query field unimplemented");
                }
                for(let i = 0; i < incomingEdges.length; i++){
                  mergedEdges[offset + i] = incomingEdges[i]
                }

                return {
                  ...merged,
                  edges: mergedEdges
                };
              },
              read(existing: RunConnection | undefined, options: RunsQueryFieldFunctionOptions ): RunConnection | undefined{
                if(!existing){
                  return undefined;
                }
                const offset = options.args?.pagination?.offset?.skip ?? 0;
                const take = options.args?.pagination?.offset?.take ?? 0;
                if(lodash.isNil(options.args?.pagination?.offset?.skip)){
                  throw new Error("field policy for non paginated and cursor based pagination on runs query field unimplemented");
                }
                if(lodash.isNil(options.args?.pagination?.offset?.take)){
                  throw new Error("take is required")
                }

                const edges = existing.edges ?? []
                
                return {
                  pageInfo: existing.pageInfo,
                  __typename: existing.__typename,
                  edges: edges.slice(offset, offset+take)
                }
              }
            }
          }
        }
      }
    }
  ),
  devtools: {
    enabled: process.env.NODE_ENV === "development",
  }
});
