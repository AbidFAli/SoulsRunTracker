import * as graphql from '#generated/graphql/types.js';
import { prisma } from '#src/db/prisma.js';
import lodash from 'lodash';

const { max} = lodash;


export const runResolvers: graphql.RunResolvers = {
  async cycles(parent){
    console.log('run.cycles resolver executed')
    if(parent.cycles){
      return parent.cycles;
    }
    return prisma.cycle.findMany({where: { runId: parent.id}, orderBy: {level: "asc"}})
  },
  character(parent){
    if(parent.character){
      return parent.character;
    }
    return prisma.character.findUnique({where: { runId: parent.id}});
  },
  async currentCycle(parent){
    if(parent.currentCycle !== null && parent.currentCycle !== undefined){
      return parent.currentCycle
    }
    if(parent.cycles){
      return max(parent.cycles.map((cycle) => cycle.level ?? 0)) ?? null;
    }
    const maxCycle = await prisma.cycle.aggregate({
      _max: {
        level: true
      },
      where: {
        runId: parent.id
      }
    });
    return maxCycle._max.level;
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