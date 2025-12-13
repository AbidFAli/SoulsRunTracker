import js from "@eslint/js";
import graphqlPlugin from '@graphql-eslint/eslint-plugin';
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  { files: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.node },
    rules: {
      "no-shadow": "error"
    }
   },
  tseslint.configs.recommended,
  {
    files: ['**/*.graphql'],
    languageOptions: {
      parser: graphqlPlugin.parser
    },
    plugins: {
      '@graphql-eslint': graphqlPlugin
    }
  },
  {
    files: ['./src/api/schema/*.graphql'],
    rules: {
      ...graphqlPlugin.configs['flat/schema-recommended'].rules,
      "@graphql-eslint/require-description": 'off',
      "@graphql-eslint/naming-convention": 'off',
      "@graphql-eslint/no-unreachable-types": 'off'
    }
  },
  {
    files: ['./src/test/queries/*.graphql'],
    rules: {
      ...graphqlPlugin.configs['flat/operations-recommended'].rules,
      "@graphql-eslint/require-description": 'off',
      "@graphql-eslint/naming-convention": 'off',
      "@graphql-eslint/no-unreachable-types": 'off'
    }
  }
]);
