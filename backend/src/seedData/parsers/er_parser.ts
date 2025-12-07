import { readFileSync, writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import lodash from 'lodash';
import type { LocationSeedData } from './types.js';
import { ProgramOutput } from './types.js';


const {uniq} = lodash;

const OUTPUT_FILE_PATH='./backend/src/seedData/html/er_bosses.json';
const INPUT_FILE_PATH='./backend/src/seedData/html/fextralife_er_bosses.html';
const file = readFileSync(INPUT_FILE_PATH, {encoding: "utf-8"});


const dom = new JSDOM(file);
const tabs =dom.window.document.querySelectorAll(`div.tutorial-tab`);
if(tabs.length == 0){
  process.exit(-1);
} 
const rows = tabs[1].querySelectorAll(`div.col-sm-4`);
if(rows.length === 0){
  process.exit(-1);
}

//shadow of the erdtree bosses come first on fextralife, but should be ordered last
let sotetBosses: string[] = [];
const sotetLocationSeedData: LocationSeedData[] = [];

let bosses: string[] = [];
const locationSeedData: LocationSeedData[] = [];
let sotetOver = false;

rows.forEach((row) => {
  const locationName = getLocationName(row);
  if(!locationName){
    console.log('Error no link found for location name search');
    process.exit(-1);
  }
  const locationBosses = getBosses(row);
  if(locationName.trim() === "Limgrave"){
    sotetOver= true;
  }
  if(!sotetOver){
    sotetBosses = sotetBosses.concat(locationBosses);
    sotetLocationSeedData.push({
      name: locationName,
      bossInstances: locationBosses
    })
  }
  else{
    bosses = bosses.concat(locationBosses)
    locationSeedData.push({
      name: locationName,
      bossInstances: locationBosses
    })
  }
});
bosses = bosses.concat(sotetBosses);
sotetLocationSeedData.forEach((sotetSeedData) => locationSeedData.push(sotetSeedData));

bosses = uniq(bosses);



/*
Form1: <a>Boss name</a>
Form2: <a>Boss Phase 1</a> + <a> Boss Phase 2 </a>
Form3: <a>Boss Name</a> (<a>Location Name </a>)
Form5: <a>Boss Phase 1<a> / <a> Boss Phase 2 </a>
Form6: <a> Godskin Apostle and Godskin Noble </a> (Spiritcaller Snail)


Exceptions:
  Jagged Peak Drake - there are two in Jagged Peak but you don't fight together.

*/
function getBosses(row: Element){
  const listItems = row.querySelectorAll(`li`);
  const foundBosses: string[] = [];
  listItems.forEach((item) => {
    const bossName = item.textContent.replace(/\u00A0/g, " ");
    foundBosses.push(bossName)
  });

  return foundBosses;
}

function getLocationName(row: Element){
  const link = row.querySelector(`h4 a`);
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


