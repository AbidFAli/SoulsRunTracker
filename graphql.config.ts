import type { IGraphQLConfig } from "graphql-config"
import type { CodegenConfig } from '@graphql-codegen/cli'

const frontendConfig: CodegenConfig = {
   generates: {
    './frontend/src/generated/graphql/': {
        preset: 'client',
      }
   }
}


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
   generates: {
    './backend/generated/graphql/test/': {
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

const config: IGraphQLConfig = {
  projects: {
    frontend: {
      schema: "./backend/src/api/schema/*.graphql",
      documents: "./frontend/src/graphql/*.graphql",
      extensions: {
        codegen: frontendConfig,
      } 
    },
    backend: {
      schema: "./backend/src/api/schema/*.graphql",
      documents: "./backend/src/test/queries/*.graphql",
      extensions: {
        codegen: backendConfig
      }
    }
  }
}

export default config;