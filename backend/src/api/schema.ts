import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import path from 'path'
import { resolvers } from './resolvers/index.js'


const tempPath = path.join(import.meta.dirname, './schema/');
const typesArray = loadFilesSync(tempPath, {extensions: ['graphql']})
 
const typeDefs = mergeTypeDefs(typesArray);

export const schema = makeExecutableSchema({typeDefs, resolvers});
