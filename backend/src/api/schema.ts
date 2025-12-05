import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import path from 'path'
 
const typesArray = loadFilesSync(path.join(__dirname, './schema'))
 
const typeDefs = mergeTypeDefs(typesArray)

export const schema = makeExecutableSchema({typeDefs})