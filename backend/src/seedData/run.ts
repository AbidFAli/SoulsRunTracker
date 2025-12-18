import runs from './json/run.json' with { type: 'json' };

export interface RunSeedData {
    id: string;
    userId: string;
    name: string;
    completed: boolean;
    game: string;
    deaths: number;
}

export const RUNS: RunSeedData[] = [...runs];