import fs from 'node:fs';
import path from 'node:path';

const failures=[];
const dist='dist';
const assets=path.join(dist,'assets');
const index=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const scriptMatch=index.match(/<script[^>]+src="([^"]+\.js)"/i);
if(!scriptMatch) failures.push('Could not identify the production entry script from dist/index.html.');

const jsFiles=fs.readdirSync(assets).filter(name=>name.endsWith('.js'));
if(jsFiles.length<8) failures.push(`Expected a code-split build with at least 8 JS chunks, found ${jsFiles.length}.`);

let entryName='';
if(scriptMatch){
  entryName=path.basename(scriptMatch[1]);
  const entryPath=path.join(assets,entryName);
  if(!fs.existsSync(entryPath)) failures.push(`Entry chunk ${entryName} does not exist.`);
  else {
    const bytes=fs.statSync(entryPath).size;
    if(bytes>300_000) failures.push(`Initial entry chunk is ${(bytes/1024).toFixed(1)} KiB; Gold budget is 293 KiB.`);
  }
}

for(const name of jsFiles){
  const bytes=fs.statSync(path.join(assets,name)).size;
  if(/^Dither-/i.test(name)){
    if(bytes>1_100_000) failures.push(`Lazy Dither chunk grew beyond 1.05 MiB: ${(bytes/1024/1024).toFixed(2)} MiB.`);
    continue;
  }
  if(bytes>300_000) failures.push(`Non-Dither chunk ${name} is ${(bytes/1024).toFixed(1)} KiB; investigate lost code splitting.`);
}

if(/Dither-|MoltenMetal-|ReadExperience61-|CardLibrary-|FoolsJourney-|JournalExperience-|LearnCourse-/.test(index)){
  failures.push('A lazy feature chunk is referenced directly by index.html and may be eager-loaded.');
}

if(failures.length){
  console.error(`Phase 8 BUNDLE AUDIT FAILED with ${failures.length} issue(s):`);
  failures.forEach(item=>console.error(`- ${item}`));
  process.exit(1);
}

const entryBytes=entryName?fs.statSync(path.join(assets,entryName)).size:0;
const largest=jsFiles.map(name=>({name,bytes:fs.statSync(path.join(assets,name)).size})).sort((a,b)=>b.bytes-a.bytes)[0];
console.log('Phase 8 bundle audit passed.');
console.log(`Initial entry: ${entryName} ${(entryBytes/1024).toFixed(1)} KiB.`);
console.log(`JS chunks: ${jsFiles.length}. Largest lazy chunk: ${largest.name} ${(largest.bytes/1024).toFixed(1)} KiB.`);
