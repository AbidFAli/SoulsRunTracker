import { createApp } from "#src/index.js";
import { describe } from "node:test";
import request from 'supertest';
import { createConfigData } from "#src/seedData/config.js";
import { prisma } from "#src/db/prisma.js";
import { afterAll, afterEach, beforeAll, test, expect } from "vitest";
import { resetDatabase } from "../util/db.js";
import { executeOperation } from "../util/graphql.js";
import { CreateRunDocument} from "#generated/graphql/test/graphql.js"
import { v4 as createId } from "uuid";
import assert from "assert";
const app = await createApp();
const api = request(app);

beforeAll(async () => {
  await resetDatabase()
  await createConfigData();
})

afterEach(async () => {
  await resetDatabase({keepConfigData: true});
})

afterAll((async () => {
  await resetDatabase();
  await prisma.$disconnect();
}))

describe('tests for createRun mutation', () => {
  test('creating a run creates a cycle with boss completions', async () => {
    const user = await prisma.user.create({data: {
      id: createId()
    }});
    const game = await prisma.game.findUnique({where: {name: "Elden Ring"}});
    const runName = "First Run"
    assert(game !== null);

    const response = await executeOperation(api, CreateRunDocument, {
      input: {
        userId: user.id,
        gameId: game.id,
        name: runName,
        completed: false,
      }
    });
    assert(! (response instanceof String));
    const cycle = response.data?.createRun?.cycles?.[0];
    assert(cycle !== null && cycle !== undefined);

    const bossCompletions = await prisma.bossCompletion.findMany({
      where: {
        cycleId: cycle.id
      },
      orderBy: {
        instanceId: "asc"
      }
    });

    const bossCompletionsMap = new Map<string, string>(bossCompletions.map(
      (bossCompletion) => 
      ([bossCompletion.instanceId, bossCompletion.id])
    ));

    const bossInstances = await prisma.bossInstance.findMany({
      where: {
        gameLocation: {
          gameId: game.id
        }
      },
      orderBy: {
        id: "asc"
      }
    });

    const bossInstancesWithoutCompletions = bossInstances.filter((bossInstance) => {
      return !bossCompletionsMap.has(bossInstance.id)
    });

    expect(bossInstancesWithoutCompletions).toHaveLength(0);
  });

})