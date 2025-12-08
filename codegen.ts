import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
   schema: './backend/src/api/schema/*.graphql',
   documents: ['./frontend/src/graphql/*.graphql'],
   generates: {
    './frontend/src/generated/graphql/': {
        preset: 'client',
      },
    './backend/generated/graphql/types.ts': {
        config: {
          useIndexSignature: true,
        },
        plugins: ['typescript', 'typescript-resolvers'],
      }
   }
}


export default config