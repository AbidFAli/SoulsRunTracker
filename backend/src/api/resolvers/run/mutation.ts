import * as graphql from '#generated/graphql/types.js';
import { RunCreateInput } from '#generated/prisma/models.js';
import { prisma } from '#src/db/prisma.js';
import type { Prisma } from '#generated/prisma/client.js';
import { Unnullified } from '#src/util/utilityTypes.js';
import lodash from 'lodash';

const { isNil, compact, flatMap} = lodash;


export const runMutationResolvers: Pick<graphql.MutationResolvers, "createRun" | "deleteRuns"> = {
  async createRun(parent, args){
    const cleanedInput = args.run as Unnullified<graphql.RunCreateInput>;
    const runCreateInput: RunCreateInput = {
      name: cleanedInput.name,
      descriptionUrl: cleanedInput.descriptionUrl,
      completed: cleanedInput.completed,
      deaths: cleanedInput.deaths,
      game: {
        connect: {
          id: cleanedInput.gameId
        }
      },
      user: {
        connect: {
          id: cleanedInput.userId
        }
      },
      character: cleanedInput.character ? {create: { ...cleanedInput.character}} : undefined,
      cycles: {
        create: {
          completed: false,
          level: 0,
        }
      }
    }

    const transactionResult = await prisma.$transaction(async(txn) => {
      const run = await txn.run.create({
        data: runCreateInput,
        include: {
          character: true,
          cycles: true,
        }
      })
      return {
        run
      }
    })

    const run : graphql.Run = transactionResult.run;
    return run;
  },
  async deleteRuns(parent, args){
    if((args.where.ids && args.where.ids.length == 0) || (isNil(args.where.all) && isNil(args.where.ids))){
      throw new Error("must specify id's to be deleted or use all argument");
    }
    
    const runWhereInput: Prisma.RunWhereInput = {
        userId: args.where.userId,
        id: args.where.all ? undefined : {in: args.where.ids as string[]}
    }

    const runs = await prisma.run.findMany({
      where: runWhereInput,
      include: {
        character: {
          select: {
            id: true,
            imageId: true,
          }
        }
      }
    })

    const characters = compact(runs.map((run) => run.character));
    const characterIds = characters.map((char) => char.id);
    const characterImages = compact(characters.map((char) => char.imageId));

    //this could be a lot of data
    const cycles = await prisma.cycle.findMany({
      where: {
        runId: {
          in: runs.map((run) => run.id)
        }
      },
      include: {
        bossesCompleted: {
          select: {
            id: true
          }
        }
      }
    })

    const bossesCompleted = flatMap(cycles, ((cycle) => cycle.bossesCompleted)).map((bossCompletion) => bossCompletion.id);

    await prisma.$transaction([
      prisma.character.deleteMany({
        where: {
          id: {
            in: characterIds,
          }
        }
      }),
      prisma.image.deleteMany({
        where: {
          id: {
            in: characterImages
          }
        }
      }),
      prisma.bossCompletion.deleteMany({
        where: {
          id: {
            in: bossesCompleted
          }
        }
      }),
      prisma.cycle.deleteMany({
        where: {
          id: {
            in: cycles.map((cycle) => cycle.id)
          }
        }
      }),
      prisma.run.deleteMany({
        where: runWhereInput
      })
    ]);

    return true;
  }
}