import { gameQueryResolvers } from './game.js'
import type { Resolvers } from "./types.js"

export const resolvers: Resolvers = {
  Query: {
    ...gameQueryResolvers
  }
}