import bb_bosses from './html/bb_bosses.json' with { type: 'json' };
import ds2_bosses from './html/ds2_bosses.json' with { type: 'json' };
import er_bosses from './html/er_bosses.json' with { type: 'json' };
import type { LocationSeedData } from './types.js';


export type GameAbbreviation = "demonSouls" | "ds1" | "ds2" | "sotfs" | "bloodborne" | "ds3" | "sekiro" | "er";
export const GAME_TO_ABBREVIATION: Record<string, GameAbbreviation> = {
    "Demon's Souls": "demonSouls",
		"Dark Souls" : "ds1",
    "Dark Souls 2" : "ds2",
    "Dark Souls 2: Scholar of the First Sin": "sotfs",
    "Bloodborne": "bloodborne",
    "Dark Souls 3": "ds3",
    "Sekiro: Shadows Die Twice" : "sekiro",
    "Elden Ring" : "er",
};



export const ABBREVIATION_TO_GAME : Record<GameAbbreviation, string> = 
  Object.fromEntries(
    Object.keys(GAME_TO_ABBREVIATION).map((key) => [GAME_TO_ABBREVIATION[key], key])
  ) as Record<GameAbbreviation, string>;

export const BOSSES: Record<GameAbbreviation, string[]> = {
  demonSouls: [
    "Phalanx",
    "Blue Dragon",
    "Red Dragon",
    "Tower Knight",
    "Penetrator",
    "Primeval Demon",
    "Old King Allant",
    "Armor Spider",
    "Flamelurker",
    "Dragon God",
    "Fool's Idol",
    "Maneater",
    "Old Monk",
    "Adjudicator",
    "Vanguard",
    "Old Hero",
    "Storm King",
    "Leechmonger",
    "Dirty Collosus",
    "Maiden Astraea"
  ],
  ds1: [
    "Asylum Demon",
    "Bell Gargoyles",
    "Capra Demon",
    "Ceaseless Discharge",
    "Centipede Demon",
    "Chaos Witch Quelaag",
    "Crossbreed Priscilla",
    "Dark Sun Gwyndolin",
    "Demon Firesage",
    "Four Kings",
    "Gaping Dragon",
    "Great Gray Wolf Sif",
    "Gwyn, Lord of Cinder",
    "Iron Golem",
    "Moonlight Butterfly",
    "Gravelord Nito",
    "Orenstein and Smough",
    "Pinwheel",
    "Seath the Scaleless",
    "Stray Demon",
    "Taurus Demon",
    "Bed of Chaos",
    "Sanctuary Guardian",
    "Artorias the Abysswalker",
    "Black Dragon Kalameet",
    "Manus, Father of the Abyss"
  ],
  ds2: ds2_bosses.bosses.filter((boss) => !boss.includes("Aldia")),
  sotfs: ds2_bosses.bosses,
  bloodborne: bb_bosses.bosses,
  ds3: [
    "Iudex Gundyr",
    "Vordt of the Boreal Valley",
    "Curse-Rotted Greatwood",
    "Crystal Sage",
    "Abyss Watchers",
    "Deacons of the Deep",
    "High Lord Wolnir",
    "Old Demon King",
    "Pontiff Sulyvahn",
    "Yhorm the Giant",
    "Aldrich, Devourer of Gods",
    "Dancer of the Boreal Valley",
    "Dragonslayer Armour",
    "Oceiros, the Consumed King",
    "Champion Gundyr",
    "Lothric, Younger Prince",
    "Ancient Wyvern",
    "Nameless King",
    "Soul of Cinder",
    "Sister Friede",
    "Champion's Gravetender and Gravetender Greatwolf",
    "Demon in Pain and Demon From Below / Demon Prince",
    "Halflight, Spear of the Church",
    "Darkeater Midir",
    "Slave Knight Gael"
  ],
  sekiro: [
    "Gyoubu Masataka Oniwa",
    "Lady Butterfly",
    "Genichiro Ashina",
    "Folding Screen Monkeys",
    "Guardian Ape",
    "Headless Ape",
    "Corrupted Monk",
    "Emma, the Gentle Blade and Isshin Ashina",
    "Great Shinobi Owl",
    "True Corrupted Monk",
    "Divine Dragon",
    "Owl (Father)",
    "Demon of Hatred",
    "Isshin, the Sword Saint",
  ],
  er: er_bosses.bosses
}



export const LOCATIONS: Record<GameAbbreviation, LocationSeedData[]> = {
  demonSouls: [
    {
      name: "Boletarian Palace", 
      bossInstances: [
        "Phalanx",
        "Blue Dragon",
        "Red Dragon",
        "Tower Knight",
        "Penetrator",
        "Primeval Demon",
        "Old King Allant"
      ]
    },
    {
      name: "Stonefang Tunnel", 
      bossInstances: [
        "Armor Spider",
        "Flamelurker",
        "Dragon God",
        "Primeval Demon",
      ]
    },
    {
      name: "Tower of Latria", 
      bossInstances: [
        "Fool's Idol",
        "Maneater",
        "Old Monk",
        "Primeval Demon",
      ]},
    {
      name: "Shrine of Storms", 
      bossInstances: [
        "Adjudicator",
        "Vanguard",
        "Old Hero",
        "Storm King",
        "Primeval Demon",
      ]},
    {
      name: "Valley of Defilement", 
      bossInstances: [
        "Leechmonger",
        "Dirty Collosus",
        "Maiden Astraea",
        "Primeval Demon",
      ]
    },
  ],
  ds1: [
    {
      name: "Undead Asylum",
      bossInstances: [
        "Asylum Demon",
        "Stray Demon",

      ]
    },
    {
      name: "Undead Burg/Undead Parish",
      bossInstances: [
        "Taurus Demon",
        "Bell Gargoyles",
        "Capra Demon"
      ]
    },
    {
      name: "Depths",
      bossInstances: [
        "Gaping Dragon"
      ]
    },
    {
      name: "Blighttown/Quelaag's Domain",
      bossInstances: ["Chaos Witch Quelaag"]
    },
    {
      name: "Darkroot Garden",
      bossInstances: ["Moonlight Butterfly", "Great Gray Wolf Sif"]
    },
    {
      name: "Sen's Fortress",
      bossInstances: ["Iron Golem"]
    },
    {
      name: "Anor Londo",
      bossInstances: [
        "Orenstein and Smough", 
        "Dark Sun Gwyndolin",        
      ]
    },
    {
      name: "Painted World of Ariamis",
      bossInstances: ["Crossbreed Priscilla"]
    },
    {
      name: "The Duke's Archives/Crystal Cave",
      bossInstances: ["Seath the Scaleless"]
    },
    {
      name: "The Catacombs",
      bossInstances: ["Pinwheel"]
    },
    {
      name: "Tomb of the Giants",
      bossInstances: ["Gravelord Nito"]
    },
    {
      name: "New Londo Ruins",
      bossInstances: ["Four Kings"]
    },
    {
      name: "Demon Ruins",
      bossInstances: [
        "Ceaseless Discharge",
        "Demon Firesage",
        "Centipede Demon",
      ]
    },
    {
      name: "Lost Izalith",
      bossInstances: [
        "Bed of Chaos"
      ]
    },
    {
      name: "Kiln of the First Flames",
      bossInstances: ["Gwyn, Lord of Cinder"]
    },
    {
      name: "Sanctuary Garden",
      bossInstances: ["Sanctuary Guardian"]
    },
    {
      name: "Royal Wood",
      bossInstances: [
        "Artorias the Abysswalker",
        "Black Dragon Kalameet"
      ]
    },
    {
      name: "Chasm of the Abyss",
      bossInstances: [
        "Manus, Father of the Abyss"
      ]
    },
    
  ],
  ds2: ds2_bosses.locations.map((location) => {
    let bossInstances = location.bossInstances;
    if(location.name === "Throne of Want"){
      bossInstances= bossInstances.filter(boss => !boss.includes("Aldia"))
    }
    return {
      name: location.name,
      bossInstances
    }
  }),
  sotfs: ds2_bosses.locations,
  bloodborne: bb_bosses.locations,
  ds3: [
    {
      name: "Cemetery of Ash",
      bossInstances: ["Iudex Gundyr"]
    },
    {
      name: "High Wall of Lothric",
      bossInstances: ["Vordt of the Boreal Valley", "Dancer of the Boreal Valley"]
    },
    {
      name: "Undead Settlement",
      bossInstances: ["Curse-Rotted Greatwood"]
    },
    {
      name: "Road of Sacrifices",
      bossInstances: ["Crystal Sage"]
    },
    {
      name: "Farron Keep",
      bossInstances: ["Abyss Watchers"]
    },
    {
      name: "Cathedral of the Deep",
      bossInstances: ["Deacons of the Deep"]
    },
    {
      name: "Catacombs of Carthus",
      bossInstances: ["High Lord Wolnir"]
    },
    {
      name: "Smouldering Lake",
      bossInstances: ["Old Demon King"]
    },
    {
      name: "Irithyll of the Boreal Valley",
      bossInstances: ["Pontiff Sulyvahn"],
    },
    {
      name: "Profaned Capital",
      bossInstances: ["Yhorm the Giant"]
    },
    {
      name: "Anor Londo",
      bossInstances: ["Aldrich, Devourer of Gods"]
    },
    {
      name: "Lothric Castle",
      bossInstances: ["Dragonslayer Armour", "Lothric, Younger Prince"]
    },
    {
      name: "Consumed King's Garden",
      bossInstances: ["Oceiros, the Consumed King"]
    },
    {
      name: "Untended Graves",
      bossInstances: ["Champion Gundyr"]
    },
    {
      name: "Archdragon Peak",
      bossInstances: ["Ancient Wyvern", "Nameless King"]
    },
    {
      name: "Kiln of the First Flame",
      bossInstances: ["Soul of Cinder"]
    },
    {
      name: "Painted World of Ariandel",
      bossInstances: ["Sister Friede", "Champion's Gravetender and Gravetender Greatwolf"]
    },
    {
      name: "The Dreg Heap",
      bossInstances: ["Demon in Pain and Demon From Below / Demon Prince"]
    },
    {
      name: "The Ringed City",
      bossInstances: ["Halflight, Spear of the Church", "Darkeater Midir", "Slave Knight Gael"]
    }
  ],
  sekiro: [
    {
      name: "Ashina Outskirts",
      bossInstances: [ "Gyoubu Masataka Oniwa", "Demon of Hatred"]
    },
    {
      name: "Hirata Estate",
      bossInstances: ["Lady Butterfly", "Owl (Father)"]
    },
    {
      name: "Ashina Reservoir",
      bossInstances: ["Genichiro Ashina", "Isshin, the Sword Saint"]
    },
    {
      name: "Ashina Castle",
      bossInstances: [
        "Genichiro Ashina", 
        "Emma, the Gentle Blade and Isshin Ashina", 
        "Great Shinobi Owl"
      ]
    },
    {
      name: "Senpou Temple",
      bossInstances: ["Folding Screen Monkeys"]
    },
    {
      name: "Sunken Valley Passage",
      bossInstances: ["Guardian Ape"]
    },
    {
      name: "Ashina Depths",
      bossInstances: ["Headless Ape", "Corrupted Monk"]
    },
    {
      name: "Fountainhead Palace",
      bossInstances: ["True Corrupted Monk", "Divine Dragon"]
    },
  ],
  er: er_bosses.locations
}
