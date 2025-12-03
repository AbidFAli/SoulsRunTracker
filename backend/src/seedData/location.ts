import locations from './json/location.json' with { type: 'json' };



export const LOCATIONS : LocationSeedData[] = [...locations]

export interface NestedBossInstanceWithoutLocation{
  name: string;
  game: string;
  order: number;
}

export interface LocationSeedData{
  name: string;
  games: string[];
  bossInstances: NestedBossInstanceWithoutLocation[];
}




