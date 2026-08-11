import fs from 'node:fs';
import path from 'node:path';
import { TAROT_CARDS } from '../src/data/tarotDataset.js';

const failures=[];
const notes=[];
function fail(message){failures.push(message);}
function read(file){return fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');}
function filesUnder(dir){
  const out=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())out.push(...filesUnder(full));else out.push(full);
  }
  return out;
}

// Routing / GitHub Pages refresh safety.
const router=read('src/shell/router.jsx');
const vite=read('vite.config.js');
if(!router.includes('window.location.hash')) fail('Router is not hash-based; GitHub Pages refresh safety may regress.');
if(!router.includes("window.addEventListener('hashchange'")) fail('Router does not react to hash changes.');
if(!vite.includes("base: '/Palimpsest/'")) fail('GitHub Pages base path is not /Palimpsest/.');
if(!vite.includes("publicDir: 'assets'")) fail('Production asset source changed; re-audit deployment contents.');

// Deck / deployment hygiene.
if(TAROT_CARDS.length!==78) fail(`Expected 78 tarot cards, found ${TAROT_CARDS.length}.`);
const referenced=new Set(TAROT_CARDS.map(card=>card.image));
if(referenced.size!==78) fail('Card image references are not unique.');
const shipped=filesUnder('assets').filter(file=>fs.statSync(file).isFile());
const shippedImages=shipped.filter(file=>/\.(png|jpe?g|webp|avif)$/i.test(file));
const forbidden=shipped.filter(file=>/(contact[_ -]?sheet|full[_ -]?sheet|deck[_ -]?sheet|all[_ -]?cards|sprite)/i.test(path.basename(file)));
if(forbidden.length) fail(`QA/full-sheet assets would ship: ${forbidden.join(', ')}`);
const cardPngs=shipped.filter(file=>/assets[\\/]cards[\\/].*\.png$/i.test(file));
if(cardPngs.length!==79) fail(`Expected 78 fronts + 1 back in shipping card tree, found ${cardPngs.length}.`);
const cardBytes=cardPngs.reduce((sum,file)=>sum+fs.statSync(file).size,0);
const cardMB=cardBytes/1024/1024;
notes.push(`Shipping card PNG baseline: ${cardPngs.length} files, ${cardMB.toFixed(2)} MiB.`);
if(cardMB>28) fail(`Shipping card assets exceed 28 MiB (${cardMB.toFixed(2)} MiB); investigate accidental duplication or optimize.`);
if(cardPngs.some(file=>fs.statSync(file).size>550_000)) fail('At least one shipping card image exceeds 550 KB.');

// Graphics degradation / effect budget.
const graphics=read('src/utils/graphics.js');
const dither=read('src/vendor/react-bits/Dither/Dither.jsx');
const molten=read('src/vendor/react-bits/MoltenMetal/MoltenMetal.jsx');
const threads=read('src/vendor/react-bits/Threads/Threads.jsx');
for(const token of ["forced==='off'","forced==='low'",'failIfMajorPerformanceCaveat','deviceMemory','hardwareConcurrency']) if(!graphics.includes(token)) fail(`Graphics capability contract missing ${token}.`);
if(!dither.includes("detectGraphicsMode()==='off'")) fail('Dither lacks WebGL-off fallback.');
if(!molten.includes("mode!=='full'")) fail('Molten does not disable itself in low/off graphics modes.');
if(!threads.includes("mode!=='full'")||!threads.includes('getClientRects().length')) fail('Threads lacks low/off or hidden-container guard.');

// Reduced motion must exist across every major experience.
for(const file of ['src/styles/home.css','src/styles/shell.css','src/styles/cards-modal-fix.css','src/styles/journey-performance.css','src/styles/read.css','src/styles/journal.css']){
  const source=read(file);
  if(!/prefers-reduced-motion\s*:\s*reduce/i.test(source)) fail(`${file}: no reduced-motion rule.`);
}

// Read resilience.
const readUi=read('src/components/read/ReadExperience61.jsx');
if(!readUi.includes('const QUESTION_MAX = 280')) fail('Read question limit is not 280 characters.');
if(!readUi.includes('maxLength={QUESTION_MAX}')) fail('Question textarea does not enforce its limit.');
if(!readUi.includes("entry.orientation==='reversed'")) fail('Read result does not explicitly render reversed orientation.');
if(!readUi.includes("setSaveStatus(error.message||'Could not save this reading.')")) fail('Read save flow does not expose storage failure.');
if(!readUi.includes('aria-modal="true"')||!readUi.includes('aria-label="Choose a tarot card"')) fail('Read card picker dialog labels are incomplete.');

// Journal unavailable/corrupt-backup resilience.
const store=read('src/storage/journalStore.js');
const journal=read('src/components/journal/JournalExperience.jsx');
if(!store.includes("'indexedDB' in globalThis")) fail('Journal does not explicitly detect unavailable IndexedDB.');
for(const token of ['validateJournalBackup','Unsupported backup version','must contain exactly three cards','mode===\'replace\'']) if(!store.includes(token.replace('\\',''))) fail(`Backup validation contract missing: ${token}.`);
if(!journal.includes("catch(error){setStatus(error.message||'Restore failed.');}")) fail('Corrupt restore does not surface a readable error.');

// Accessibility basics: named dialogs, close controls, orientation text, alt text.
const cardLibrary=read('src/components/cards/CardLibrary.jsx');
const journey=read('src/components/journey/FoolsJourney.jsx');
for(const [label,source] of [['Cards',cardLibrary],['Journey',journey],['Read',readUi]]){
  if(source.includes('role="dialog"')&&!source.includes('aria-modal="true"')) fail(`${label}: dialog missing aria-modal.`);
}
if(!cardLibrary.includes('aria-labelledby="card-focus-title"')) fail('Card detail dialog is not labelled by its title.');
if(!journey.includes('aria-label={`${card.name} in the Fool\'s Journey`}')) fail('Journey focus dialog lacks an accessible name.');

if(failures.length){
  console.error(`Phase 8 GOLD QA AUDIT FAILED with ${failures.length} issue(s):`);
  failures.forEach(item=>console.error(`- ${item}`));
  notes.forEach(item=>console.error(`NOTE: ${item}`));
  process.exit(1);
}
console.log('Phase 8 automated Gold QA gate passed.');
notes.forEach(item=>console.log(item));
console.log('Automated coverage: hash-route safety, deck completeness, deployment hygiene, graphics degradation, reduced motion, storage/backup resilience, long-question limit, orientation rendering and baseline accessibility contracts.');
console.log('Real-browser/device matrix remains a manual Gold certification step; see docs/GOLD_QA_MATRIX.md.');
