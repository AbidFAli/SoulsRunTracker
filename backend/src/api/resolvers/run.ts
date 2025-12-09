import * as graphql from '#generated/graphql/types.js';
import { RunCreateInput } from '#generated/prisma/models.js';
import { prisma } from '#src/db/prisma.js';
import { Unnullified } from '#src/util/utilityTypes.js';


export const runResolvers: graphql.RunResolvers = {
  async cycles(parent){
    if(parent.cycles){
      return parent.cycles;
    }
    return prisma.cycle.findMany({where: { runId: parent.id}, orderBy: {level: "asc"}})
  },
  character(parent){
    if(parent.character){
      return parent.character;
    }
    return prisma.character.findUnique({where: { runId: parent.id}});
  }
}

interface BossCompletionSqlRecord{
  id: string;
  cycleId: string;
  completed: boolean;
  instanceId: string;
}

export const runMutationResolvers: Pick<graphql.MutationResolvers, "createRun"> = {
  async createRun(parent, args){
    const cleanedInput = args.run as Unnullified<graphql.RunCreateInput>;
    const runCreateInput: RunCreateInput = {
      name: cleanedInput.name,
      descriptionUrl: cleanedInput.descriptionUrl,
      completed: cleanedInput.completed,
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
      const cycle = run.cycles[0];

      const bossCompletions = await txn.$queryRaw<BossCompletionSqlRecord[]>`
        insert into "BossCompletion" ("cycleId", "completed", "instanceId")
        select ${cycle.id}, false, bi.id from "BossInstance" bi
        where bi."gameId" = ${cleanedInput.gameId}
        returning id, "cycleId", "completed", "instanceId"
      `

      return {
        run,
        bossCompletions
      }
    })

    const run : graphql.Run = transactionResult.run;
    if(run.cycles){
      run.cycles[0].bossesCompleted = transactionResult.bossCompletions;
    }
    return run;
  }
}