import type { IGraphQLConfig } from "graphql-config"
import type { CodegenConfig } from '@graphql-codegen/cli'

const frontendConfig: CodegenConfig = {
   generates: {
    './src/generated/graphql/': {
        preset: 'client',
        presetConfig: {
          fragmentMasking: false
        },
        config: {
          scalars: {
            Cursor: {
              input: 'string',
              output: 'string'
            }
          }
        }
      }
   }
}




const config: IGraphQLConfig = {
  schema: "../backend/src/api/schema/*.graphql",
  documents: "./src/graphql/*.graphql",
  extensions: {
    codegen: frontendConfig,
  }
}

export default config;