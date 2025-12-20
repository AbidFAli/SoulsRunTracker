import * as graphql from '#generated/graphql/types.js';
import { RunWhereInput, 
  RunOrderByWithRelationInput, 
  CharacterOrderByWithRelationInput,
  GameOrderByWithRelationInput
 } from '#generated/prisma/models.js';
import { prisma } from '#src/db/prisma.js';
import * as filterToPrisma from '#src/api/utility/filterToPrisma.js';
import * as z from 'zod';
import { validatePaginationCursorInput } from '../../utility/pagination.js';



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

function convertRunOrderByInputToPrisma(data: graphql.RunOrderByInput): RunOrderByWithRelationInput{
  const returnValue: RunOrderByWithRelationInput = {
    character: data.character ? convertCharacterOrderByInputToPrisma(data.character) : undefined,
    game: data.game ? convertGameOrderByInputToPrisma(data.game) : undefined,
  }
  const easyFields = ["completed", "createdAt", "deaths", "id", "modifiedAt", "name"] as const
  for(const key of easyFields){
    returnValue[key] = data[key] ? filterToPrisma.convertSortOrder(data[key]) : undefined
  }
  return returnValue;
}

function convertCharacterOrderByInputToPrisma(data: graphql.CharacterOrderByInput): CharacterOrderByWithRelationInput {
  const returnValue: CharacterOrderByWithRelationInput = {}
  const easyFields = ["level", "name"] as const
  for(const key of easyFields){
    returnValue[key] = data[key] ? filterToPrisma.convertSortOrder(data[key]) : undefined
  }

  return returnValue;
}

function convertGameOrderByInputToPrisma(data: graphql.GameOrderByInput): GameOrderByWithRelationInput {
  return {
    name: data.name ? filterToPrisma.convertSortOrder(data.name) : undefined
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
    const orderBy = args.orderBy ? args.orderBy.map((runOrderByInput) => convertRunOrderByInputToPrisma(runOrderByInput)) : undefined;

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
      orderBy: orderBy ? orderBy : {modifiedAt: 'asc'}
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