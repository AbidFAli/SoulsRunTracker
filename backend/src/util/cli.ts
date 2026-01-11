import { argv } from 'node:process'
/**
 * @description pass import.meta.filename to this
 * @param path 
 * @returns whether module is being called from command line(true) or imported(false)
 */
export function isCli(path: string): boolean{
  return path === argv[1]
}