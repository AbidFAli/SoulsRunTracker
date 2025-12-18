import {
  GameLocationCreateWithoutLocationInput
} from '#generated/prisma/models.js';
import { prisma } from '#src/db/prisma.js';
import { ABBREVIATION_TO_GAME, BOSSES, GameAbbreviation } from './boss.js';
import { GAMES } from './game.js';
import { LOCATIONS, LocationSeedData, NestedBossInstanceWithoutLocation } from './location.js';
import { GAME_STATS, GameStatSeedDataItem, STATS } from './stats.js';

import as from 'async';
import lodash from 'lodash';



const {flatMap} = lodash;

const LOCATION_MAP_LIMIT = 10;


async function createBossesInDB(){
  await prisma.boss.createMany({
    data: BOSSES.map((boss) => {
      return {
        name: boss
      }
    })
  });
}

function createLocationsInDB(){
  return as.mapLimit(LOCATIONS.entries(), LOCATION_MAP_LIMIT, async (entry: [number, LocationSeedData]) => {
      const locationOrder = entry[0];
      const location = entry[1];

      const gameLocation: GameLocationCreateWithoutLocationInput[] =
        location.games.map((game) => {
          return {
            order: locationOrder,
            game:  {
              connect: {
                name: game
              }
            }
          }
        });

        return await prisma.location.create({
          data: {
            name: location.name,
            gameLocation: {
              create: gameLocation
            },
          }
        });

    });

}

interface LocationSeedDataWithId extends LocationSeedData{
  id: string;
}

interface BossInstanceWithLocation extends NestedBossInstanceWithoutLocation{
  locationId: string;
}

async function createBossInstancesInDB(){
  const locationsWithIds: LocationSeedDataWithId[] = await as.mapLimit(LOCATIONS, LOCATION_MAP_LIMIT, 
    async (locationSeedData: LocationSeedData) => {
      const locations = await prisma.location.findMany({
        where: {
          name: {
            equals: locationSeedData.name
          },
        }
      });

      const error_id =`locationName=${locationSeedData.name}`
      if(locations.length === 0){
        throw new Error("no locations found for " + error_id)
      }
      if(locations.length > 1){
        throw new Error("multiple locations found for " + error_id)
      }
      return {
        ...locationSeedData,
        id: locations[0].id
      }
  });

  const bossInstances: BossInstanceWithLocation[] = flatMap(locationsWithIds, (locationWithId) => {
    return locationWithId.bossInstances.map((bossInstance) => {
      return {
        ...bossInstance,
        locationId: locationWithId.id
      }
    })
  });

  return as.mapLimit(bossInstances, LOCATION_MAP_LIMIT, async (bossInstance: BossInstanceWithLocation) => {
    return await prisma.bossInstance.create({
        data: {
          order: bossInstance.order,
          boss: {
            connect: {
              name: bossInstance.name
            }
          },
          location: {
            connect: {
              id: bossInstance.locationId
            }
          },
          game: {
            connect: {
              name: bossInstance.game
            }
          }
        }
      });
  });
}

interface GameStatSeedDataItemWithGame extends GameStatSeedDataItem{
  gameName: string;
  order: number;
}

async function createStatsInDB(){
  await prisma.stat.createMany({
    data: STATS
  });

  const gameStatsWithGame: GameStatSeedDataItemWithGame[] = flatMap(GAME_STATS, (gameStats, abbreviation) => {
    return gameStats.map((gameStat, index) => {
      return {
        ...gameStat,
        gameName: ABBREVIATION_TO_GAME[(abbreviation as GameAbbreviation)],
        order: index
      }
    })
  });

  await as.mapLimit(gameStatsWithGame, LOCATION_MAP_LIMIT, 
    async (gameStat: GameStatSeedDataItemWithGame) => {
      return prisma.gameStat.create({
          data: {
            order: gameStat.order,
            stat: {
              connect: {
                name: gameStat.name
              }
            },
            alternateName: gameStat.alternateName,
            maximum: gameStat?.maximum,
            minimum: gameStat?.minimum,
            game: {
              connect: {
                name: gameStat.gameName
              }
            }
          }
        });
  });

  
}



export async function createConfigData(){
  await prisma.game.createMany({
    data: GAMES.map(g => ({name: g}))
  })
  
  await createBossesInDB();
  await createLocationsInDB();
  await createBossInstancesInDB();
  await createStatsInDB();
}