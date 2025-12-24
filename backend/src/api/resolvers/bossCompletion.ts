import * as graphql from '#generated/graphql/types.js';
import { prisma } from '#src/db/prisma.js';

export const bossCompletionResolvers: graphql.BossCompletionResolvers = {
  async instance(parent){
    if(parent.instance){
      return parent.instance;
    }
    const bossInstance = await prisma.bossInstance.findUnique({
      where: {
        id: parent.instanceId
      }
    });

    if(!bossInstance){
      throw new Error(`no boss instance found for BossCompletion ${parent.instanceId}`);
    }

    return bossInstance;

  }
}