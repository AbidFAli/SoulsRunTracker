export const GAME_TO_ABBREVIATION = new Map<string, string>([
    ["Demon's Souls", "demon-souls"],
		["Dark Souls", "dark-souls"],
    ["Dark Souls 2", "dark-souls-2"],
    ["Dark Souls 2: Scholar of the First Sin", "dark-souls-2-sotfs"],
    ["Bloodborne", "bloodborne"],
    ["Dark Souls 3", "dark-souls-3"],
    ["Sekiro: Shadows Die Twice", "sekiro"],
    ["Elden Ring", "elden-ring"]
  ]
);

export const ABBREVIATION_TO_GAME = new Map<string, string>(
  GAME_TO_ABBREVIATION.entries().map((entry) => [entry[1], entry[0]])
);