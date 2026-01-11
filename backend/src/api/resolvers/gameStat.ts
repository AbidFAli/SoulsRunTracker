import * as graphql from '#generated/graphql/types.js';
import { prisma } from '#src/db/prisma.js';

export const gameStatFieldResolvers: graphql.GameStatResolvers = {
  image(parent){
    if(parent.image){
      return parent.image;
    }
    if(!parent.imageId){
      return null;
    }
    return prisma.image.findUnique({where: { id: parent.imageId}});
  },
  stat(parent){
    if(parent.stat){
      return parent.stat
    }
    if(!parent.statId){
      return null;
    }

    return prisma.stat.findUnique({where: { id: parent.statId}});
  }
}