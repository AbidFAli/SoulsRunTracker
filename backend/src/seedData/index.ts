import {
  GameLocationCreateWithoutLocationInput,
  GameWhereUniqueInput
} from '../../generated/prisma/models.js';
import { prisma } from '../db/prisma.js';
import { ABBREVIATION_TO_GAME, BOSSES, GameAbbreviation, LOCATIONS } from './bossInstance.js';
import { GAME_STATS, STATS } from './stats.js';
const GAMES = [
  	"Demon's Souls",
		"Dark Souls",
    "Dark Souls 2",
    "Dark Souls 2: Scholar of the First Sin",
    "Bloodborne",
    "Dark Souls 3",
    "Sekiro: Shadows Die Twice",
    "Elden Ring"
]

interface BossData
{
  name: string, 
  id: string,
  games: {id: string, name: string}[]
}


//get bossId from (gameName, bossName)
//Map<bossName, Map<gameName, BossData>>
type BossMap = Map<string, Map<string, BossData>>;

function createBossMap(bosses: BossData[]): BossMap{
  const bossMap: BossMap = new Map();

  bosses.forEach((boss) => {
    if(bossMap.get(boss.name) !== undefined){
      throw new Error("Seed data script does not support multiple bosses with the same name");
    }
    const gameMap = new Map<string, BossData>();
    boss.games.forEach((game) => {
      gameMap.set(game.name, boss)
    });
    bossMap.set(boss.name, gameMap);
    
  })
  return bossMap;
}

function getBossDataFromBossMap(bossMap: BossMap, gameName: string, bossName: string){
  const gameMap = bossMap.get(bossName)
  if(gameMap === undefined){
    return undefined
  }
  return gameMap.get(gameName)
}


async function createBossesInDB(): Promise<BossData[]>{
  const bosses: BossData[] = [];
  for(const abbreviation in BOSSES){
    //all sotfs bossess are in ds2 except aldia
    if( (abbreviation as GameAbbreviation) === "ds2"){
      continue;
    }
    for(const bossName of BOSSES[abbreviation as GameAbbreviation]){
      const connect: GameWhereUniqueInput[] = [
        {name: ABBREVIATION_TO_GAME[abbreviation as GameAbbreviation]}
      ];
      if((abbreviation as GameAbbreviation) === "sotfs" && !bossName.includes("Aldia")){
        connect.push({
          name: ABBREVIATION_TO_GAME["ds2"]
        });
      }

      const boss = await prisma.boss.create({
        data: {
          name: bossName,
          games: {
            connect
          }
        },
        include: {
          games: true
        }
      });
      bosses.push(boss);


    }
  }
  return bosses
}

async function createLocationsInDB(){
    for(const abbreviation in LOCATIONS){
    if((abbreviation as GameAbbreviation) === "ds2"){
      continue;
    }
    for(const [locationOrder, location] of LOCATIONS[abbreviation as GameAbbreviation].entries()){
      const gameName = ABBREVIATION_TO_GAME[abbreviation as GameAbbreviation];

      const gameLocation: GameLocationCreateWithoutLocationInput[] =
      [
        {
          order: locationOrder,
          game: {
            connect: {
              name: gameName
            }
          }
        } 
      ]
      
      if((abbreviation as GameAbbreviation) === "sotfs"){
        gameLocation.push({
          order: locationOrder,
          game: {
            connect: {
              name: ABBREVIATION_TO_GAME.ds2
            }
          }
        })
      }



      await prisma.location.create({
        data: {
          name: location.name,
          gameLocation: {
            create: gameLocation
          },
        }
      });
    }
  }
}

/*
Record<GameAbbreviation, LocationSeedData>
*/
async function createBossInstancesInDB(bossMap: BossMap){
  for(const abbreviation in LOCATIONS){
    const gameName = ABBREVIATION_TO_GAME[abbreviation as GameAbbreviation];
    for(const locationSeedData of LOCATIONS[abbreviation as GameAbbreviation]){
      const locations = await prisma.location.findMany({
        where: {
          name: {
            equals: locationSeedData.name
          },
          gameLocation: {
            some: {
              game: {
                name: {
                  equals: gameName
                }
              }
            }
          }
        }
      });

      const error_id =`locationName=${locationSeedData.name},gameName=${gameName}`
      if(locations.length === 0){
        throw new Error("no locations found for " + error_id)
      }
      if(locations.length > 1){
        throw new Error("multiple locations found for " + error_id)
      }


      for(const [index, bossInstance] of locationSeedData.bossInstances.entries()){
        const boss = getBossDataFromBossMap(bossMap, 
          ABBREVIATION_TO_GAME[abbreviation as GameAbbreviation], bossInstance);

        if(!boss){
          throw new Error(`no boss data found from gameName=${gameName}, bossName=${bossInstance}`);
        }


        await prisma.bossInstance.create({
          data: {
            order: index,
            bossId: boss.id,
            locationId: locations[0].id,
          }
        });

        
      }
    }
  }

}

async function createStatsInDB(){
  await prisma.stat.createMany({
    data: STATS
  });

  for(const abbreviation in GAME_STATS){
    for(const [index, gameStat] of GAME_STATS[(abbreviation as GameAbbreviation)].entries()){
      await prisma.gameStat.create({
        data: {
          order: index,
          stat: {
            connect: {
              name: gameStat.name
            }
          },
          alternateName: gameStat.alternateName,
          game: {
            connect: {
              name: ABBREVIATION_TO_GAME[(abbreviation as GameAbbreviation)]
            }
          }
        }
      });

    }
  }
  
}

async function main() {
  await prisma.game.createManyAndReturn({
    data: GAMES.map(g => ({name: g}))
  })
  
  const bosses = await createBossesInDB();
  const bossMap = createBossMap(bosses);
  await createLocationsInDB();
  await createBossInstancesInDB(bossMap);
  await createStatsInDB();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await prisma.user.createMany({data: new Array({size: 10}).map(_ => ({}))});


}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })