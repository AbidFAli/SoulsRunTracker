import type { SpawnSyncReturns } from 'child_process';
import { execSync } from "child_process";
import { mkdir } from "fs/promises";
import { dest, src } from 'gulp';

const graphQlSchemaDir = {
  source: './src/api/schema',
  dest: './build/src/api/schema'
}

function execSyncBoilerplate(command: string){
  try{
    const output = execSync(command, {encoding: 'utf-8'});
    console.log(output);
  }
  catch(error: unknown){
    const knownError= error as SpawnSyncReturns<string>;
    console.log(knownError.stdout);
    throw error;
  }
}

async function generate(){
  execSyncBoilerplate('npm run generate');
}

async function build() {
  await generate();
  execSyncBoilerplate('tsc');
  
  try{
    await mkdir(graphQlSchemaDir.dest)
  }catch(_){
  }

  await execSync(`rm ${graphQlSchemaDir.dest}/*.graphql`);

  return src(graphQlSchemaDir.source+'/*.graphql')
    .pipe(dest(graphQlSchemaDir.dest));
}

export default build;