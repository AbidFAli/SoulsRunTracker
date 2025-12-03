import { prisma } from '../db/prisma.js';

async function main(){
  await prisma.character.deleteMany();
  await prisma.gameStat.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.bossCompletion.deleteMany();
  await prisma.cycle.deleteMany();
  await prisma.run.deleteMany();
  await prisma.bossInstance.deleteMany();
  await prisma.boss.deleteMany();
  await prisma.gameLocation.deleteMany();
  await prisma.location.deleteMany();

  await prisma.game.deleteMany();
  await prisma.image.deleteMany();
  await prisma.user.deleteMany();
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