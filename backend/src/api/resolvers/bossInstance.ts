import * as graphql from '#generated/graphql/types.js';
import { prisma } from '#src/db/prisma.js';

export const bossInstanceResolvers: graphql.BossInstanceResolvers ={
  async boss(parent){
    if(parent.boss){
      return parent.boss;
    }
    if(!parent.bossId){
      return null;
    }
    return prisma.boss.findUnique({where: { id: parent.bossId}});
  }
}