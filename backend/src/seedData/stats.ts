import type { GameAbbreviation } from "./boss.js";

export interface StatSeedDataItem{
  name: string;
  displayName: string;
}
export const STATS: StatSeedDataItem[] = [
  {
    name: "vitality",
    displayName: "Vitality"
  },
  {
    name: "intelligence",
    displayName: "Intelligence"
  },
  {
    name: "endurance",
    displayName: "Endurance"
  },
  {
    name: "strength",
    displayName: "Strength"
  },
  {
    name: "dexterity",
    displayName: "Dexterity"
  },
  {
    name: "magic",
    displayName: "Magic"
  },
  {
    name: "faith",
    displayName: "Faith"
  },
  {
    name: "luck",
    displayName: "luck"
  },
  {
    name: "attunement",
    displayName: "Attunement",
  },
  {
    name: "resistance",
    displayName: "Resistance"
  },
  {
    name: "vigor",
    displayName: "Vigor"
  },
  {
    name: "adaptability",
    displayName: "Adaptability"
  },
  {
    name: "insight",
    displayName: "Insight"
  },
  {
    name: "skill",
    displayName: "Skill"
  },
  {
    name: "bloodtinge",
    displayName: "Bloodtinge"
  },
  {
    name: "mind",
    displayName: "Mind"
  },
  {
    name: "hp",
    displayName: "HP"
  },
  {
    name: "mp",
    displayName: "MP"
  },
  {
    name: "stamina",
    displayName: "Stamina"
  },
  {
    name: "arcane",
    displayName: "Arcane"
  }
] as const

export interface GameStatSeedDataItem{
  name: string;
  alternateName?: string;
  minimum?: number;
  maximum?: number;
}

function NormalStat(args: {name: string, alternateName?: string}): GameStatSeedDataItem {
  return {
    ...args,
    minimum: 1,
    maximum: 99,
  }
}


const DS2_GAME_STATS: GameStatSeedDataItem[] = [
    NormalStat({name: "vigor"}),
    NormalStat({name: "endurance"}),
    NormalStat({name: "vitality"}),
    NormalStat({name: "attunement"}),
    NormalStat({name: "strength"}),
    NormalStat({name: "dexterity"}),
    NormalStat({name: "adaptability"}),
    NormalStat({name: "intelligence"}),
    NormalStat({name: "faith"}),
    {
      name: "hp",
      minimum: 1,
      maximum: 9999,
    },
    {
      name: "stamina",
      minimum: 1,
      maximum: 9999,
    }
  ];



export const GAME_STATS: Record<GameAbbreviation, GameStatSeedDataItem[]> = {
  bloodborne: [
    NormalStat({name: "insight"}),
    NormalStat({name: "vitality"}),
    NormalStat({name: "endurance"}),
    NormalStat({name: "strength"}),
    NormalStat({name: "skill"}),
    NormalStat({name: "bloodtinge"}),
    NormalStat({name: "arcane"}),
    {
      name: "hp",
      minimum: 1,
      maximum: 9999,
    },
    {
      name: "stamina",
      minimum: 1,
      maximum: 9999
    }


  ],
  demonSouls: [
    NormalStat({name: "vitality"}),
    NormalStat({name: "intelligence"}),
    NormalStat({name: "endurance"}),
    NormalStat({name: "strength"}),
    NormalStat({name: "dexterity"}),
    NormalStat({name: "magic"}),
    NormalStat({name: "faith"}),
    NormalStat({name: "luck"}),
    {
      name: "hp",
      minimum: 1,
      maximum: 9999,
    },
    {
      name: "mp",
      minimum: 1,
      maximum: 9999,
    },
    {
      name: "stamina",
      minimum: 1,
      maximum: 9999,
    }
  ],
  ds1: [
    NormalStat({name: "vitality"}),
    NormalStat({name: 'attunement'}),
    NormalStat({name: "endurance"}),
    NormalStat({name: "strength"}),
    NormalStat({name: "dexterity"}),
    NormalStat({name: "resistance"}),
    NormalStat({name: "intelligence"}),
    NormalStat({name: "faith"}),
    {
      name: "hp",
      minimum: 1,
      maximum: 9999,
    },
    {
      name: "stamina",
      minimum: 1,
      maximum: 9999,
    }
  ],
  ds2: DS2_GAME_STATS,
  sotfs: DS2_GAME_STATS,
  ds3: [
    NormalStat({name: "vigor"}),
    NormalStat({name: "attunement"}),
    NormalStat({name: "endurance"}),
    NormalStat({name: "vitality"}),
    NormalStat({name: "strength" }),
    NormalStat({name: "dexterity"}),
    NormalStat({name: "intelligence"}),
    NormalStat({name: "faith"}),
    NormalStat({name: "luck"}),

    {
      name: "hp",
      minimum: 1,
      maximum: 9999,
    },
    {
      name: "mp",
      alternateName: "FP",
      minimum: 1,
      maximum: 9999,
    },
    {
      name: "stamina",
      minimum: 1,
      maximum: 9999,
    }
  ],
  sekiro: [],
  er: [
    NormalStat({name: "vigor"}),
    NormalStat({name: "mind"}),
    NormalStat({name: "endurance"}),
    NormalStat({name: "strength"}),
    NormalStat({name: "dexterity"}),
    NormalStat({name: "intelligence"}),
    NormalStat({name: "faith"}),
    NormalStat({name: "arcane"}),
    {
      name: "hp",
      minimum: 1,
      maximum: 9999,
    },
    {
      name: "mp",
      alternateName: "FP",
      minimum: 1,
      maximum: 9999,
    },
    {
      name: "stamina",
      minimum: 1,
      maximum: 9999,
    }
  ]

}