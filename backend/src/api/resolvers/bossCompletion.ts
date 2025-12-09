import * as graphql from '#generated/graphql/types.js';
import { prisma } from '#src/db/prisma.js';

export const bossCompletionResolvers: graphql.BossCompletionResolvers = {
  instance(parent){
    if(parent.instance){
      return parent.instance;
    }
    if(!parent.instanceId){
      return null;
    }
    return prisma.bossInstance.findUnique({
      where: {
        id: parent.instanceId
      }
    });
    
  }
}