import type { Cycle } from '../../generated/prisma/client.js';
import { createId } from './id.js';
import { RUNS } from './run.js';


function createCycles(): Cycle[]{
  const cycles = RUNS.map((run) => {
    return {
      id: createId(),
      completed: false,
      level: 0,
      runId: run.id
    }
  });

  cycles[0].completed = true;

  for(let i = 1; i <= 10; i++){
    cycles.push(
      {
        id: createId(),
        completed: i !== 10,
        level: i,
        runId: cycles[0].runId
      }
    )
  }

  return cycles;
}
export const CYCLES = createCycles();

