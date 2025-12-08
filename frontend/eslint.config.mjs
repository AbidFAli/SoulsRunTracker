import graphqlPlugin from '@graphql-eslint/eslint-plugin';
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";


const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
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
    files: ['./src/graphql/*.graphql'],
    rules: {
      ...graphqlPlugin.configs['flat/operations-recommended'].rules,
      "@graphql-eslint/require-description": 'off',
      "@graphql-eslint/naming-convention": 'off',
      "@graphql-eslint/no-unreachable-types": 'off'
    }
  }
]);

export default eslintConfig;
