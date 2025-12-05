import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
   schema: './src/api/schema/*.graphql',
   generates: {
      './src/generated/graphql/resolvers-types.ts': {
        config: {
          useIndexSignature: true,
        },
        plugins: ['typescript', 'typescript-resolvers'],
      }
   }
}
export default config