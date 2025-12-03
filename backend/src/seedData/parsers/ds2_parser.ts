import { readFileSync, writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import lodash from 'lodash';
import type { LocationSeedData } from './types.js';


console.log(process.cwd())

const { uniq} = lodash;
const OUTPUT_FILE_PATH='./backend/src/seedData/html/ds2_bosses.json'
const file = readFileSync('./backend/src/seedData/html/fextralife_ds2_bosses.html', {encoding: "utf-8"})

const dom = new JSDOM(file);
const tbody =dom.window.document.querySelector(`tbody`);
if(!tbody){
  console.log('no table found');
  process.exit(-1);
}
const rows = tbody.querySelectorAll('tr');
const bossData: BossDataTableRow[] =  [];


rows.forEach((row) => {
  const bossName = getBossName(row);
  if(!bossName){
    console.log('Error no link found for boss name search');
    process.exit(-1);
  }
  const locationName = getLocationName(row);
  if(!locationName){
    console.log('Error no link found for location name search');
    process.exit(-1);
  }
  bossData.push({
    boss: bossName,
    location: locationName,
  })
});



function getBossName(row: HTMLTableRowElement){
  const link = row.querySelector(`td:nth-child(1) > a`);
  if(!link){
    return undefined;
  }
  const bossName = link.textContent
  return bossName;
}

function getLocationName(row: HTMLTableRowElement){
  const link = row.querySelector(`td:nth-child(3) > a`);
    if(!link){
    return undefined;
  }
  const bossName = link.textContent
  return bossName;
}

interface BossDataTableRow{
  boss: string;
  location: string;
}

interface ProgramOutput{
  bosses: string[];
  locations: LocationSeedData[];
}

const bosses = bossData.map((row) => row.boss);
const locations = uniq(bossData.map((row) => row.location));

const locationSeedData: LocationSeedData[] = locations.map((location) => {
  const bossesInLocation = bossData.filter((row) => row.location === location)
  return {
    name: location,
    bossInstances: bossesInLocation.map((boss) => boss.boss)
  }
})


const output: ProgramOutput = {
  bosses,
  locations: locationSeedData
}


writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(output, null, 2), {encoding: "utf-8"});


