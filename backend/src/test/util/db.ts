import { prisma } from '#src/db/prisma.js';

export interface ResetDatabaseOptions{
  keepConfigData?: boolean
}
export async function resetDatabase(options?: ResetDatabaseOptions){

  await prisma.character.deleteMany();
  await prisma.bossCompletion.deleteMany();
  await prisma.cycle.deleteMany();
  await prisma.run.deleteMany();

  if(!options?.keepConfigData){
    await prisma.bossInstance.deleteMany();
    await prisma.boss.deleteMany();
    await prisma.gameLocation.deleteMany();
    await prisma.location.deleteMany();
    await prisma.gameStat.deleteMany();
    await prisma.stat.deleteMany();
    await prisma.game.deleteMany();
  }


  await prisma.image.deleteMany();
  await prisma.user.deleteMany();
}