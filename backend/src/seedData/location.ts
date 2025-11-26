import locations from './json/location.json' with { type: 'json' };



export const LOCATIONS : LocationObject[] = [...locations]

interface BossInstanceLocationObject{
  name: string;
  game: string;
  order: number;
}

interface LocationObject{
  name: string;
  games: string[];
  bossInstances: BossInstanceLocationObject[];
}




