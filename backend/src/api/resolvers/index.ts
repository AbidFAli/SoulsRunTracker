import { bossCompletionResolvers } from './bossCompletion.js'
import { bossInstanceResolvers } from './bossInstance.js'
import { cycleResolvers } from './cycle.js'
import { gameFieldResolvers, gameQueryResolvers } from './game.js'
import { gameLocationFieldResolvers } from './gameLocation.js'
import { gameStatFieldResolvers } from './gameStat.js'
import { runMutationResolvers, runResolvers } from './run.js'
import type { Resolvers } from "./types.js"

export const resolvers: Resolvers = {
  Run: runResolvers,
  GameLocation: gameLocationFieldResolvers,
  Game: gameFieldResolvers,
  Cycle: cycleResolvers,
  BossInstance: bossInstanceResolvers,
  BossCompletion: bossCompletionResolvers,
  GameStat: gameStatFieldResolvers,
  Query: {
    ...gameQueryResolvers
  },
  Mutation: {
    ...runMutationResolvers,
  }
}