import * as z from "zod";
import { GAME_TO_ABBREVIATION } from "./gameAbbreviation";

export const ZRunCreatePageUrlSearchParams = z.object({
  game: z.string() //game abbreviation
})

export type RunCreatePageUrlSearchParams = z.infer<typeof ZRunCreatePageUrlSearchParams>;



export function makeCreateRunPageUrl(gameName: string, userId: string){
  const searchParams = new URLSearchParams({game: GAME_TO_ABBREVIATION.get(gameName) ?? ''})
  return `/user/${userId}/runs/create?${searchParams.toString()}`
}