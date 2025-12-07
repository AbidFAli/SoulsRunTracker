import * as graphql from '#generated/graphql/types.js';
import type { GameWhereInput, GameWhereUniqueInput } from '#generated/prisma/models.js';
import * as filterToPrisma from '#src/api/utility/filterToPrisma.js';
import { prisma } from '#src/db/prisma.js';
import type { ResolversObject } from "./types.js";


function convertGameWhereInput(data: graphql.GameWhereInput): GameWhereInput{
  const prismaInput: GameWhereInput ={
    id: data.id ? filterToPrisma.convertStringFilter(data.id) : undefined,
    name: data.name ? filterToPrisma.convertStringFilter(data.name) : undefined,
  };
  const andArray = (data.AND ?? []).map((gqlInput) => convertGameWhereInput(gqlInput));
  const orArray = (data.OR ?? []).map((gqlInput) => convertGameWhereInput(gqlInput));
  const notArray = (data.NOT ?? []).map((gqlInput) => convertGameWhereInput(gqlInput));
  prismaInput.AND = andArray.length > 0 ? andArray : undefined;
  prismaInput.OR = orArray.length > 0 ? orArray : undefined;
  prismaInput.NOT = notArray.length > 0 ? notArray : undefined;
  
  return prismaInput;
}

export const gameQueryResolvers: ResolversObject = {
  async game(_, args: graphql.QueryGameArgs){
    const where = args.where;
    if(!where.id && !where.name){
      throw new Error("GameWhereUniqueInput needs at least id or name")
    }
    return prisma.game.findUnique({where: where as GameWhereUniqueInput})
  },
  async games(_, args: graphql.QueryGamesArgs){
    const where = args.where ? convertGameWhereInput(args.where) : undefined
    const games = await prisma.game.findMany({ where});
    return games;
  }
}