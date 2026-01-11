import type { CharacterCreateManyInput } from '#generated/prisma/models.js';
import { RunSeedData } from './run.js';
import { faker} from '@faker-js/faker'
import { GAME_NAMES } from './game.js';


export const CHARACTERS: CharacterCreateManyInput[] = [
  {
    name: "Ihlum Cimei",
    runId: "3c0e0dbe-c900-43f5-b3cc-e49c20a3d09e",
    level: 1,
    vitality: 10,
    intelligence: 20,
    endurance: 8,
    strength: 4,
    dexterity: 8,
    magic: 9,
    faith: 8,
    luck: 2,
    hp: 100,
    mp: 20,
    stamina: 20,
  },
  {
    name: "Ahmeir Henna",
    runId: "6d9d95b6-d9a1-42d8-bba1-a552464f72e5",
    level: 10,
    vitality: 12,
    attunement: 15,
    endurance: 10,
    strength: 20,
    dexterity: 41,
    resistance: 9,
    intelligence: 9,
    faith: 11,
    hp: 200,
    stamina: 40,
  },
  {
    name: "Grondem Rockwind",
    runId: "02144811-f9b3-4877-bac4-0fe2e658f5cb",
    level: 14,
    vigor: 12,
    endurance: 41,
    vitality: 13,
    attunement: 4,
    strength: 50,
    dexterity: 11,
    adaptability: 12,
    intelligence: 13,
    faith: 11,
    hp: 400,
    stamina: 100,
  },
  {
    name: "Vuldodd Dragonblight",
    runId: "d8628f30-a2b3-4347-9a9d-3b8c557863cd",
    level: 20,
    vigor: 12,
    endurance: 41,
    vitality: 13,
    attunement: 4,
    strength: 50,
    dexterity: 11,
    adaptability: 12,
    intelligence: 13,
    faith: 11,
    hp: 400,
    stamina: 100,
  },
  {
    name: "Pirvar Detsk",
    runId: "c19c683e-3367-4b02-ae64-6182f8805bd3",
    level: 40,
    insight: 99,
    vitality: 40,
    endurance: 20,
    strength: 10,
    skill: 10,
    bloodtinge: 40,
    arcane: 10,
    hp: 1000,
    stamina: 200,
  },
  {
    name: "Bon Glordig",
    runId: "f3d34200-7a80-44a9-9f34-9e12e8c79286",
    level: 15,
    vigor: 20,
    attunement: 10,
    endurance: 15,
    vitality: 8,
    strength: 4,
    dexterity: 23,
    intelligence: 17,
    faith: 11,
    luck: 16,
    hp: 200,
    stamina: 100,
    mp: 50,
  },
  {
    name: "Zuth Marblebleeder",
    runId: "b89a34bf-af8e-4121-aadf-5dc67c53957a",
    level: 20,
    vigor: 99,
    mind: 30,
    endurance: 21,
    strength: 10,
    dexterity: 10,
    intelligence: 15,
    faith: 11,
    arcane: 20,
    hp: 350,
    mp: 100,
    stamina: 200,
  },
  {
    name: "Duzim-Kes Vathuethukt",
    runId: "9ff6f940-e839-45e1-aa70-bc4cbf4de065",
    level: 39,
    vigor: 99,
    mind: 30,
    endurance: 21,
    strength: 10,
    dexterity: 10,
    intelligence: 15,
    faith: 11,
    arcane: 20,
    hp: 350,
    mp: 100,
    stamina: 200,
  },
  {
    name: "Trorbur Rapidbow",
    runId: "41f61748-b217-4fb3-8010-b2a8c147dbb9",
    level: 22,
    vigor: 99,
    mind: 30,
    endurance: 21,
    strength: 10,
    dexterity: 10,
    intelligence: 15,
    faith: 11,
    arcane: 20,
    hp: 350,
    mp: 100,
    stamina: 200,
  },
]


function generateNormalStat(){
  return faker.number.int({max: 99, min: 1})
}

function generateHpLikeStat(){
  return faker.number.int({max: 2000, min: 300})
}

export function makeCharacterCreateManyInput(run: RunSeedData): CharacterCreateManyInput {
  const commonStats: CharacterCreateManyInput= {
    name: faker.person.fullName(),
    hp: generateHpLikeStat(),
    stamina: generateHpLikeStat(),
    level: faker.number.int({max:300, min: 1}),
    runId: run.id,
  }


  switch(run.game){
    case GAME_NAMES.bloodborne: {
      return {
        ...commonStats,
        insight: generateNormalStat(),
        vitality: generateNormalStat(),
        endurance: generateNormalStat(),
        strength: generateNormalStat(),
        skill: generateNormalStat(),
        bloodtinge: generateNormalStat(),
        arcane: generateNormalStat(),
      }
    }
    break;
    case GAME_NAMES.darkSouls1: {
      return {
        ...commonStats,
        vitality: generateNormalStat(),
        attunement: generateNormalStat(),
        endurance: generateNormalStat(),
        strength: generateNormalStat(),
        dexterity: generateNormalStat(),
        resistance: generateNormalStat(),
        intelligence: generateNormalStat(),
        faith: generateNormalStat(),
      }
    }
    break;
    case GAME_NAMES.darkSouls2:
    case GAME_NAMES.softs: {
      return {
        ...commonStats,
        vigor: generateNormalStat(),
        endurance: generateNormalStat(),
        vitality: generateNormalStat(),
        attunement: generateNormalStat(),
        strength: generateNormalStat(),
        dexterity: generateNormalStat(),
        adaptability: generateNormalStat(),
        intelligence: generateNormalStat(),
        faith: generateNormalStat(),
      }
    }
    break;
    case GAME_NAMES.darkSouls3: {
      return {
        ...commonStats,
        vigor: generateNormalStat(),
        attunement: generateNormalStat(),
        endurance: generateNormalStat(),
        vitality: generateNormalStat(),
        strength: generateNormalStat(),
        dexterity: generateNormalStat(),
        intelligence: generateNormalStat(),
        faith: generateNormalStat(),
        luck: generateNormalStat(),
        mp: generateHpLikeStat(),
      }
    }
    break;
    case GAME_NAMES.demonSouls: {
      return {
        ...commonStats,
        vitality: generateNormalStat(),
        intelligence: generateNormalStat(),
        endurance: generateNormalStat(),
        strength: generateNormalStat(),
        dexterity: generateNormalStat(),
        magic: generateNormalStat(),
        faith: generateNormalStat(),
        luck: generateNormalStat(),
        mp: generateHpLikeStat(),
      }
    }
    break;
    case GAME_NAMES.eldenRing: {
      return {
        ...commonStats,
        vigor: generateNormalStat(),
        mind: generateNormalStat(),
        endurance: generateNormalStat(),
        strength: generateNormalStat(),
        dexterity: generateNormalStat(),
        intelligence: generateNormalStat(),
        faith: generateNormalStat(),
        arcane: generateNormalStat(),
        mp: generateHpLikeStat(),
      }
    }
    break;
    case GAME_NAMES.sekiro: {
      throw new Error("do not create character data for Sekrio")
    }
    break;
    default: {
      throw new Error(`Game name did not match. Was ${run.game}`)
    }
  }

}