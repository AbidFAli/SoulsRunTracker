import type { IGraphQLConfig } from "graphql-config"
import type { CodegenConfig } from '@graphql-codegen/cli'



/*
  allowParentTypeOverride
  addUnderscoreToArgsType
  contextType
  mapperTypeSuffix
  mappers
  typesSuffix/typesPrefix
  namingConvention
*/
export const backendConfig: CodegenConfig = {
  importExtension: '.js',
  config: {
    scalars: {
      Cursor: {
        input: 'string',
        output: 'string'
      }
    }
  },
  generates: {
    './generated/graphql/test/': {
        preset: 'client',
      },
    './generated/graphql/types.ts': {
        config: {
          useIndexSignature: true,
        },
        plugins: ['typescript', 'typescript-resolvers'],
      }
   }
}

const config: IGraphQLConfig = {
  schema: "./src/api/schema/*.graphql",
  documents: "./src/test/queries/*.graphql",
  extensions: {
    codegen: backendConfig
  }
}

export default config;