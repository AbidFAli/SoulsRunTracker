
export interface BossDataTableRow{
  boss: string;
  location: string;
}

export interface ProgramOutput{
  bosses: string[];
  locations: LocationSeedData[];
}

export interface LocationSeedData{
  name: string;
  bossInstances: string[];
}
