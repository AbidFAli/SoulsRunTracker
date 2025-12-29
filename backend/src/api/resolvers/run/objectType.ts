import * as graphql from '#generated/graphql/types.js';
import { prisma } from '#src/db/prisma.js';
import lodash from 'lodash';

const { maxBy} = lodash;


export const runResolvers: graphql.RunResolvers = {
  async cycles(parent){
    if(parent.cycles){
      return parent.cycles;
    }
    return prisma.cycle.findMany({where: { runId: parent.id}, orderBy: {level: "desc"}})
  },
  character(parent){
    if(parent.character){
      return parent.character;
    }
    return prisma.character.findUnique({where: { runId: parent.id}});
  },
  async currentCycle(parent){
    if(parent.currentCycle){
      return parent.currentCycle
    }
    if(parent.cycles){
      return maxBy(parent.cycles, (cycle) => cycle.level ?? -1) ?? null;
    }

    const maxCycle = await prisma.cycle.aggregate({
      _max: {
        level: true
      },
      where: {
        runId: parent.id
      },
    });

    if(maxCycle._max.level === null){
      return null;
    }

    const cycles = await prisma.cycle.findMany({
      where: {
        level: maxCycle._max.level
      }
    })
    
    if(cycles.length > 1){
      throw new Error(`too many cycles found for current cycle. Level was ${maxCycle._max.level}`);
    }
    if(cycles.length === 0){
      throw new Error("this should not happen. Cycle max level found but no cycles matching found");
    }
    return cycles[0];
  },
  async game(parent){
    if(parent.game){
      return parent.game;
    }
    if(!parent.gameId){
      return null;
    }

    return prisma.game.findUnique({where: {id: parent.gameId }})
  }
}