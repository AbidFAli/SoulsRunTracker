import type { IGraphQLConfig } from "graphql-config"
import type { CodegenConfig } from '@graphql-codegen/cli'



/*
  allowParentTypeOverride
  addUnderscoreToArgsType
  contextType
  mapperTypeSuffix
  mappers
  defaultMapper
  resolverTypeWrapperSignature
  showUnusedMappers
  typesSuffix/typesPrefix
  namingConvention
  strictScalars
*/
export const backendConfig: CodegenConfig = {
  importExtension: '.js',
  config: {
    scalars: {
      Cursor: {
        input: 'string',
        output: 'string'
      },
      DateTime: {
        input: 'string | Date',
        output: 'string | Date'
      }
    },
    defaultMapper: "Partial<{T}>",
  },
  generates: {
    './generated/graphql/test/': {
        preset: 'client',
      },
    './generated/graphql/types.ts': {
        config: {
          useIndexSignature: true,
          allowParentTypeOverride: true,
          mappers: {

          }
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