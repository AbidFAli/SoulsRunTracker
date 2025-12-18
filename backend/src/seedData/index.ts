import {
  BossCompletionCreateManyInput,
  
} from '#generated/prisma/models.js';
import { prisma } from '#src/db/prisma.js';


import as from 'async';
import lodash from 'lodash';
import { CHARACTERS } from './character.js';
import { CYCLES } from './cycle.js';
import { RUNS, RunSeedData } from './run.js';
import { USERS } from './user.js';
import { isCli } from '#src/util/cli.js';
import { createConfigData } from './config.js';
import { GAMES } from './game.js';
import { createId } from './id.js';


const {groupBy} = lodash;

const LOCATION_MAP_LIMIT = 10;







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

function createRuns(data: RunSeedData[]){
  return as.mapLimit(data, LOCATION_MAP_LIMIT, async (run: RunSeedData) => {
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
}

async function main() {
  console.log('seeding data');
  console.time("script run time");
  await createConfigData();


  await prisma.user.createMany({data: USERS});

  const extraRuns: RunSeedData[] = Array.from({length: 1000}, (_, index) => {
    return {
      completed: false,
      game: GAMES[0],
      id: createId(),
      name: `run ${index}`,
      userId: USERS[0].id
    }
  });

  await createRuns(RUNS);
  await createRuns(extraRuns);

  await prisma.character.createMany({data: CHARACTERS});
  await prisma.cycle.createMany({data: CYCLES});
  await createBossCompletionsInDB();
  console.timeEnd("script run time");

}

if(isCli(import.meta.filename)){
  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
}
