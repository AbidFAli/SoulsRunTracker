import { bossCompletionResolvers } from './bossCompletion.js'
import { bossInstanceResolvers } from './bossInstance.js'
import { cycleResolvers } from './cycle.js'
import { gameFieldResolvers, gameQueryResolvers } from './game.js'
import { gameLocationFieldResolvers } from './gameLocation.js'
import { gameStatFieldResolvers } from './gameStat.js'
import { runMutationResolvers, runResolvers, runsQueryResolvers } from './run/index.js'
import type { Resolvers } from "#generated/graphql/types.js"
import { cursorScalar } from './scalars/cursor.js'
import { DateTimeResolver } from 'graphql-scalars';

export const resolvers: Resolvers = {
  Run: runResolvers,
  GameLocation: gameLocationFieldResolvers,
  Game: gameFieldResolvers,
  Cycle: cycleResolvers,
  BossInstance: bossInstanceResolvers,
  BossCompletion: bossCompletionResolvers,
  GameStat: gameStatFieldResolvers,
  Query: {
    ...gameQueryResolvers,
    ...runsQueryResolvers,
  },
  Mutation: {
    ...runMutationResolvers,
  },
  Cursor: cursorScalar,
  DateTime: DateTimeResolver
}