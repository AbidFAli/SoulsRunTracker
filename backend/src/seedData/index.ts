import {
  GameLocationCreateWithoutLocationInput,
} from '../../generated/prisma/models.js';
import { prisma } from '../db/prisma.js';
import { ABBREVIATION_TO_GAME, BOSSES, GameAbbreviation } from './boss.js';
import { GAMES } from './game.js';
import { LOCATIONS } from './location.js';
import { GAME_STATS, STATS } from './stats.js';

import lodash from 'lodash';
import { CHARACTERS } from './character.js';
import { CYCLES } from './cycle.js';
import { RUNS } from './run.js';
import { USERS } from './user.js';

const {groupBy} = lodash;


interface BossData
{
  name: string, 
  id: string,
}





async function createBossesInDB(): Promise<BossData[]>{
  const bosses: BossData[] = [];
  for(const bossName of BOSSES){
    const boss = await prisma.boss.create({
      data: {
        name: bossName,
      },
    });
    bosses.push(boss);
  }
  return bosses
}

async function createLocationsInDB(){
    for(const [locationOrder, location] of LOCATIONS.entries()){

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

      await prisma.location.create({
        data: {
          name: location.name,
          gameLocation: {
            create: gameLocation
          },
        }
      });
  }
}


async function createBossInstancesInDB(){
  for(const locationSeedData of LOCATIONS){
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


    for(const bossInstance of locationSeedData.bossInstances){



      await prisma.bossInstance.create({
        data: {
          order: bossInstance.order,
          boss: {
            connect: {
              name: bossInstance.name
            }
          },
          location: {
            connect: {
              id: locations[0].id
            }
          },
          game: {
            connect: {
              name: bossInstance.game
            }
          }
        }
      });

      
    }
  }
}



async function createStatsInDB(){
  await prisma.stat.createMany({
    data: STATS
  });

  for(const abbreviation in GAME_STATS){
    for(const [index, gameStat] of GAME_STATS[(abbreviation as GameAbbreviation)].entries()){
      await prisma.gameStat.create({
        data: {
          order: index,
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
              name: ABBREVIATION_TO_GAME[(abbreviation as GameAbbreviation)]
            }
          }
        }
      });

    }
  }
  
}

async function createBossCompletionsInDB(){
  const cycles = await prisma.cycle.findMany({
    include: {
      run: true
    }
  });

  const bossInstances = await prisma.bossInstance.findMany({orderBy: {gameId: "asc"}});
  const gameBosses = groupBy(bossInstances, (bossInstance) => bossInstance.gameId);
  //Map<GameId, BossInstance[]>
  for(const cycle of cycles){
    for(const gameId in gameBosses){
      await prisma.bossCompletion.createMany({
        data: gameBosses[gameId].map((gameBoss) => {
          return {
            cycleId: cycle.id,
            instanceId: gameBoss.id,
            completed: false,
          }
        })
      })
    }
  }
}

async function main() {
  await prisma.game.createManyAndReturn({
    data: GAMES.map(g => ({name: g}))
  })
  
  await createBossesInDB();
  await createLocationsInDB();
  await createBossInstancesInDB();
  await createStatsInDB();


  await prisma.user.createMany({data: USERS});

  for(const run of RUNS){
    await prisma.run.create({
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
  }

  await prisma.character.createMany({data: CHARACTERS});
  await prisma.cycle.createMany({data: CYCLES});
  await createBossCompletionsInDB();

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