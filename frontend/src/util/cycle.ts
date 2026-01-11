import { GameInfoFragment } from "@/generated/graphql/graphql";
import type { CreateRunFormBossCompletion } from "@/state/runs/createRunForm/createRunFormSlice";

/**
 * @returns a record containing the fields in @param existing and default values for the BossInstance id's not in existing
 * @param gameInfo 
 * @param existing 
 */
export function populateBossCompletions(
  gameInfo: GameInfoFragment, 
  existing: Record<string, CreateRunFormBossCompletion>)
  : Record<string, CreateRunFormBossCompletion>{
    const returnValue: Record<string, CreateRunFormBossCompletion> = {...existing}
    gameInfo.gameLocations?.forEach((gameLocation) => {
      gameLocation?.bossInstances?.forEach((bossInstance) => {
        if(!returnValue[bossInstance.id]){
          returnValue[bossInstance.id] = {
            instanceId: bossInstance.id,
            completed: false
          }
        }
      })
    })

    return returnValue;
  }