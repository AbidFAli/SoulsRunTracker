import * as graphql from '#generated/graphql/types.js';
import { RunCreateInput, RunWhereInput } from '#generated/prisma/models.js';
import { prisma } from '#src/db/prisma.js';
import { Unnullified } from '#src/util/utilityTypes.js';
import lodash from 'lodash';
import * as filterToPrisma from '#src/api/utility/filterToPrisma.js';
import * as z from 'zod';
import { validatePaginationCursorInput } from '../utility/pagination.js';
const { max} = lodash;


export const runResolvers: graphql.RunResolvers = {
  async cycles(parent){
    console.log('run.cycles resolver executed')
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
  },
  async currentCycle(parent){
    if(parent.currentCycle !== null && parent.currentCycle !== undefined){
      return parent.currentCycle
    }
    if(parent.cycles){
      return max(parent.cycles.map((cycle) => cycle.level ?? 0)) ?? null;
    }
    const maxCycle = await prisma.cycle.aggregate({
      _max: {
        level: true
      },
      where: {
        runId: parent.id
      }
    });
    return maxCycle._max.level;
  }
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

    const bossInstances = await prisma.bossInstance.findMany({
      where: {
        gameId: cleanedInput.gameId
      }
    })
    

    const transactionResult = await prisma.$transaction(async(txn) => {
      const run = await txn.run.create({
        data: runCreateInput,
        include: {
          character: true,
          cycles: true,
        }
      })
      const cycle = run.cycles[0];

      const bossCompletions = await txn.bossCompletion.createMany({
        data: bossInstances.map((bossInstance) => {
          return {
            cycleId: cycle.id,
            instanceId: bossInstance.id,
            completed: false,
          }
        })
      });

      return {
        run,
        bossCompletions
      }
    })

    const run : graphql.Run = transactionResult.run;
    if(run.cycles){
      const bossCompletions = await prisma.bossCompletion.findMany({
        where: {
          cycleId: run.cycles[0].id
        }
      })
      run.cycles[0].bossesCompleted = bossCompletions;
    }
    return run;
  }
}

function convertRunWhereInputToPrisma(data: graphql.RunWhereInput): RunWhereInput{
  const baseFields = {
    id: data.id ? filterToPrisma.convertStringFilter(data.id) : undefined,
    name: data.name ? filterToPrisma.convertStringFilter(data.name) : undefined,
    completed: data.completed ? filterToPrisma.convertBoolFilter(data.completed) : undefined,
    gameId: data.gameId ? filterToPrisma.convertStringFilter(data.gameId) : undefined,
    userId: data.userId ? filterToPrisma.convertStringFilter(data.userId) : undefined,
  }

  const andFields = (data.AND ?? []).map((runWhereInput) => convertRunWhereInputToPrisma(runWhereInput));
  const orFields = (data.OR ?? []).map((runWhereInput) => convertRunWhereInputToPrisma(runWhereInput));
  const notFields = (data.NOT ?? []).map((runWhereInput) => convertRunWhereInputToPrisma(runWhereInput));

  return {
    ...baseFields,
    AND: andFields.length === 0 ? undefined : andFields,
    OR: orFields.length === 0 ? undefined : orFields,
    NOT: notFields.length === 0 ? undefined: notFields,
  }
}


// interface RunCursor{
//   id: string
// }

const ZRunCursor = z.object({
  id: z.string()
})

function validateRunCursor(data: unknown){
  return ZRunCursor.parse(data);
}



const DEFAULT_RUN_PAGE_SIZE=20;

export const runsQueryResolvers: Pick<graphql.QueryResolvers, "runs"> = {
  async runs(parent, args){
    const where = args.where ? convertRunWhereInputToPrisma(args.where) : undefined;
    const paginationArgs = {
      offset: args.pagination.offset,
      cursor: args.pagination.cursor ? validatePaginationCursorInput(args.pagination.cursor, validateRunCursor) : undefined,
    }
    if(paginationArgs.cursor && paginationArgs.offset){
      throw new Error("cannot use both cursor and offset based pagination");
    }
    if(paginationArgs.cursor){
      throw new Error("runs query cursor based pagination not implemented");
    }

    /*
      handle first, after, last, before
        validate cursors
      handle default
      use prisma grab a page
      determine PageInfo
        -need function to create a cursor



      questions:
        backwards pagination?
    */
   const take = paginationArgs.offset?.take ?? DEFAULT_RUN_PAGE_SIZE;
   const skip =paginationArgs.offset?.skip ?? 0;
   const totalCount = await prisma.run.count({where});
   const runs = await prisma.run.findMany({
      where: where,
      take: take + 1,
      skip,
    });


    const pageInfo: graphql.PageInfo = {
      hasNextPage: runs.length === (take+1),
      hasPreviousPage: totalCount === 0 ? false : skip !== 0,
      totalCount,
    }

    if(runs.length === take +1){
      runs.pop();
    }

    return {
      pageInfo,
      edges: runs,
    }
  }
}