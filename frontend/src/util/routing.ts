import * as z from "zod";

export const ZRunCreatePageUrlSearchParams = z.object({
  game: z.string() //game abbreviation
})

export type RunCreatePageUrlSearchParams = z.infer<typeof ZRunCreatePageUrlSearchParams>;

export function createRunCreatePageUrlSearchParams(data: RunCreatePageUrlSearchParams){
  return new URLSearchParams({...data});
}