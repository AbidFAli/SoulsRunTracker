import {
  BossCompletionCreateManyInput,
  GameLocationCreateWithoutLocationInput
} from '../../generated/prisma/models.js';
import { prisma } from '../db/prisma.js';
import { ABBREVIATION_TO_GAME, BOSSES, GameAbbreviation } from './boss.js';
import { GAMES } from './game.js';
import { LOCATIONS, LocationSeedData, NestedBossInstanceWithoutLocation } from './location.js';
import { GAME_STATS, GameStatSeedDataItem, STATS } from './stats.js';

import as from 'async';
import lodash from 'lodash';
import { CHARACTERS } from './character.js';
import { CYCLES } from './cycle.js';
import { RUNS, RunSeedData } from './run.js';
import { USERS } from './user.js';


const {groupBy, flatMap} = lodash;

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


async function createBossCompletionsInDB(){
  const cycles = await prisma.cycle.findMany({
    include: {
      run: true
    }
  });

  const bossInstances = await prisma.bossInstance.findMany({orderBy: {gameId: "asc"}});
  //Map<GameId, BossInstance[]>
  const gameBosses = groupBy(bossInstances, (bossInstance) => bossInstance.gameId);
  const bossCompletionData: BossCompletionCreateManyInput[] = [];

  for(const cycle of cycles){
    for(const gameId in gameBosses){
      gameBosses[gameId].forEach((bossInstance) => {
        bossCompletionData.push({
          cycleId: cycle.id,
          instanceId: bossInstance.id,
          completed: false
        })
      })
    }
  }

  await prisma.bossCompletion.createMany({
    data: bossCompletionData
  })
}

async function main() {
  console.time("script run time");
  await prisma.game.createManyAndReturn({
    data: GAMES.map(g => ({name: g}))
  })
  
  await createBossesInDB();
  await createLocationsInDB();
  await createBossInstancesInDB();
  await createStatsInDB();


  await prisma.user.createMany({data: USERS});

  await as.mapLimit(RUNS, LOCATION_MAP_LIMIT, async (run: RunSeedData) => {
    return prisma.run.create({
        data: {
          game: {
            connect: {
              name: run.game
            }
          },
          name: run.name,
          user: {
            connect: {
              id: run.userId
            }
          },
          id: run.id,
          completed: run.completed,
        }
    });
  });


  await prisma.character.createMany({data: CHARACTERS});
  await prisma.cycle.createMany({data: CYCLES});
  await createBossCompletionsInDB();
  console.timeEnd("script run time");

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })