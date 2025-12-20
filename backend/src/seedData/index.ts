import {
  BossCompletionCreateManyInput,
  
} from '#generated/prisma/models.js';
import { prisma } from '#src/db/prisma.js';


import as from 'async';
import lodash from 'lodash';
import { CHARACTERS, makeCharacterCreateManyInput } from './character.js';
import { CYCLES } from './cycle.js';
import { RUNS, RunSeedData } from './run.js';
import { USERS } from './user.js';
import { isCli } from '#src/util/cli.js';
import { createConfigData } from './config.js';
import { GAME_NAMES, GAMES } from './game.js';
import { createId } from './id.js';
import { faker } from '@faker-js/faker';
import type { Dayjs} from 'dayjs'
import dayjs from 'dayjs'

const {groupBy, compact} = lodash;

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

interface RunDataWithDate extends RunSeedData{
  createdAt?: Dayjs;
  modifiedAt?: Dayjs;
}

function createRuns(data: RunDataWithDate[]){
  return as.mapLimit(data, LOCATION_MAP_LIMIT, async (run: RunDataWithDate) => {
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
          deaths: run.deaths,
          createdAt: run.createdAt ? run.createdAt.toDate() : undefined,
          modifiedAt: run.modifiedAt ? run.modifiedAt.toDate() : undefined,
        }
    });
  });
}

async function main() {
  console.log('seeding data');
  console.time("script run time");
  await createConfigData();


  await prisma.user.createMany({data: USERS});

  const extraRuns: RunDataWithDate[] = Array.from({length: 1000}, (_, index) => {
    const date = dayjs().subtract(index, 'd');
    return {
      completed: index % 2 == 0,
      game: faker.helpers.arrayElement(GAMES),
      id: createId(),
      name: `run ${index}`,
      userId: USERS[0].id,
      deaths: faker.number.int({max: 9999, min: 0}),
      createdAt: date,
      modifiedAt: date,
    }
  });

  await createRuns(RUNS);
  await createRuns(extraRuns);

  await prisma.character.createMany({data: CHARACTERS});
  await prisma.character.createMany({
    data: compact(extraRuns.map((run) => {
      if(run.game === GAME_NAMES.sekiro){
        return undefined
      }
      return makeCharacterCreateManyInput(run)
    }))
  });
  
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
