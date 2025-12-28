import * as graphql from '#generated/graphql/types.js';
import { prisma } from '#src/db/prisma.js';

export const gameLocationFieldResolvers: graphql.GameLocationResolvers ={
  location(parent){
    if(parent.location){
      return parent.location;
    }
    if(!parent.locationId){
      return null;
    }
    return prisma.location.findUnique({where: {id: parent.locationId}})
  },
  bossInstances(parent){
    if(parent.bossInstances){
      return parent.bossInstances
    }
    if(!parent.gameId || !parent.locationId){
      return null;
    }
    return prisma.bossInstance.findMany({
      where: {
        gameLocationId: parent.id,
      },
      orderBy: {
        order: "asc"
      }
    });


  }
}