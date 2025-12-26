import type { Prisma } from '#generated/prisma/client.js';


export async function deleteCycles(client: Prisma.TransactionClient, ids: string[]){
  const bossCompletions = await client.bossCompletion.findMany({
    where: {
      cycleId: {
        in: ids
      }
    },
    select: {
      id: true
    }
  });

  const bossCompletionIds = bossCompletions.map((bossCompletion) => bossCompletion.id)

  client.bossCompletion.deleteMany({
    where: {
      id: {
        in: bossCompletionIds
      }
    }
  });

  return client.cycle.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  });


}