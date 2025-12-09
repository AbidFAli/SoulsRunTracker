import * as graphql from '#generated/graphql/types.js';
import { prisma } from '#src/db/prisma.js';

export const cycleResolvers: graphql.CycleResolvers = {
  bossesCompleted(parent){
    if(parent.bossesCompleted){
      return parent.bossesCompleted;
    }
    return prisma.bossCompletion.findMany({where: { cycleId: parent.id}});
  }
}