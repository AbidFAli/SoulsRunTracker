import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { type ExecutionResult, print } from 'graphql'
import type TestAgent from 'supertest/lib/agent.js';
import type supertest from 'supertest';

export async function executeOperation<TResult, TVariables>(
  api: TestAgent<supertest.Test>,
  operation: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<ExecutionResult<TResult>> {
  const response = await api.post('/api/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        query: print(operation),
        variables: variables ?? undefined
      }))
  
  return response.body //TODO idk if this is a parsed body or not
}
 
