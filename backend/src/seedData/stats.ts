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
}

const DS2_GAME_STATS: GameStatSeedDataItem[] = [
    {
      name: "vigor"
    },
    {
      name: "endurance"
    },
    {
      name: "vitality"
    },
    {
      name: "attunement"
    },
    {
      name: "strength"
    },
    {
      name: "dexterity"
    },
    {
      name: "resistance"
    },
    {
      name: "intelligence"
    },
    {
      name: "faith"
    },
    {
      name: "hp"
    },
    {
      name: "stamina"
    }
  ];
export const GAME_STATS: Record<GameAbbreviation, GameStatSeedDataItem[]> = {
  bloodborne: [
    {
      name: "insight"
    },
    {
      name: "vitality"
    },
    {
      name: "endurance"
    },
    {
      name: "strength"
    },
    {
      name: "skill"
    },
    {
      name: "bloodtinge"
    },
    {
      name: "arcane"
    },
    {
      name: "hp"
    },
    {
      name: "stamina"
    }


  ],
  demonSouls: [
    {
      name: "vitality"
    },
    {
      name: "intelligence"
    },
    {
      name: "endurance"
    },
    {
      name: "strength"
    },
    {
      name: "dexterity"
    },
    {
      name: "magic"
    },
    {
      name: "faith"
    },
    {
      name: "luck"
    },
    {
      name: "hp"
    },
    {
      name: "mp"
    }
  ],
  ds1: [
    {
      name: "vitality"
    },
    {
      name: "attunement"
    },
    {
      name: "endurance"
    },
    {
      name: "strength"
    },
    {
      name: "dexterity"
    },
    {
      name: "resistance"
    },
    {
      name: "intelligence"
    },
    {
      name: "faith"
    },
    {
      name: "hp"
    },
    {
      name: "stamina"
    }
  ],
  ds2: DS2_GAME_STATS,
  sotfs: DS2_GAME_STATS,
  ds3: [
    {
      name: "vigor"
    },
    {
      name: "attunement"
    },
    {
      name: "endurance"
    },
    {
      name: "vitality"
    },
    {
      name: "strength"
    },
    {
      name: "dexterity",
    },
    {
      name: "intelligence",
    },
    {
      name: "faith"
    },
    {
      name: "luck"
    },
    {
      name: "hp"
    },
    {
      name: "mp",
      alternateName: "FP"
    }
  ],
  sekiro: [],
  er: [
    {
      name: "vigor"
    },
    {
      name: "mind"
    },
    {
      name: "endurance"
    },
    {
      name: "strength"
    },
    {
      name: "dexterity"
    },
    {
      name: "intelligence"
    },
    {
      name: "faith"
    },
    {
      name: "arcane"
    },
    {
      name: "hp"
    },
    {
      name: "mp",
      alternateName: "FP"
    },
    {
      name: "stamina"
    }
  ]

}