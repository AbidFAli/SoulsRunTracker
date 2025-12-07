import { readFileSync, writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import type { LocationSeedData } from './types.js';
import { ProgramOutput } from './types.js';



const OUTPUT_FILE_PATH='./backend/src/seedData/html/bb_bosses.json';
const INPUT_FILE_PATH='./backend/src/seedData/html/fextralife_bb_bosses.html';
const file = readFileSync(INPUT_FILE_PATH, {encoding: "utf-8"});


const dom = new JSDOM(file);
const tabs =dom.window.document.querySelectorAll(`div.tabcurrent`);
if(tabs.length == 0){
  process.exit(-1);
} 
const rows = tabs[1].querySelectorAll(`div.col-sm-4`);
if(rows.length === 0){
  process.exit(-1);
}

let bosses: string[] = [];
const locationSeedData: LocationSeedData[] = []

rows.forEach((row) => {
  const locationName = getLocationName(row);
  if(!locationName){
    console.log('Error no link found for location name search');
    process.exit(-1);
  }
  const locationBosses = getBosses(row);
  bosses = bosses.concat(locationBosses)
  locationSeedData.push({
    name: locationName,
    bossInstances: locationBosses
  })
});


function getBosses(row: Element){
  const links = row.querySelectorAll(`li a`);
  const foundBosses: string[] = [];
  links.forEach((link) => {
    foundBosses.push(link.textContent)
  })
  return foundBosses;
}

function getLocationName(row: Element){
  const link = row.querySelector(`h3 a`);
    if(!link){
    return undefined;
  }
  return link.textContent;
}







const output: ProgramOutput = {
  bosses,
  locations: locationSeedData
}


writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(output, null, 2), {encoding: "utf-8"});


