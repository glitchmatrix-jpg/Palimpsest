const DB_NAME='palimpsest';
const DB_VERSION=1;
const STORE='readings';
export const BACKUP_SCHEMA='palimpsest-journal';
export const BACKUP_VERSION=1;

function uid(){
  if(globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `reading_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function openDb(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in globalThis)) return reject(new Error('IndexedDB is not available in this browser.'));
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(STORE)){
        const store=db.createObjectStore(STORE,{keyPath:'id'});
        store.createIndex('createdAt','createdAt');
        store.createIndex('spreadId','spreadId');
      }
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('Could not open the Palimpsest journal.'));
  });
}

function tx(mode,work){
  return openDb().then((db)=>new Promise((resolve,reject)=>{
    const transaction=db.transaction(STORE,mode);
    const store=transaction.objectStore(STORE);
    let result;
    try{ result=work(store,transaction); }catch(error){ db.close(); reject(error); return; }
    transaction.oncomplete=()=>{db.close();resolve(result);};
    transaction.onerror=()=>{const error=transaction.error||new Error('Journal transaction failed.');db.close();reject(error);};
    transaction.onabort=()=>{const error=transaction.error||new Error('Journal transaction was cancelled.');db.close();reject(error);};
  }));
}

function readRequest(request){
  return new Promise((resolve,reject)=>{
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('Journal read failed.'));
  });
}

function sanitizeSnapshot(snapshot){
  return JSON.parse(JSON.stringify(snapshot));
}

export async function saveReading(snapshot){
  const now=new Date().toISOString();
  const record=sanitizeSnapshot({
    ...snapshot,
    id:snapshot.id||uid(),
    createdAt:snapshot.createdAt||now,
    updatedAt:now,
    schemaVersion:1,
  });
  await tx('readwrite',(store)=>{store.put(record);});
  return record;
}

export async function listReadings(){
  const db=await openDb();
  try{
    const transaction=db.transaction(STORE,'readonly');
    const store=transaction.objectStore(STORE);
    const records=await readRequest(store.getAll());
    return records.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
  } finally { db.close(); }
}

export async function getReading(id){
  const db=await openDb();
  try{
    const transaction=db.transaction(STORE,'readonly');
    return await readRequest(transaction.objectStore(STORE).get(id));
  } finally { db.close(); }
}

export async function deleteReading(id){
  await tx('readwrite',(store)=>{store.delete(id);});
}

export async function clearReadings(){
  await tx('readwrite',(store)=>{store.clear();});
}

export async function updateReadingNote(id,note){
  const current=await getReading(id);
  if(!current) throw new Error('Reading not found.');
  return saveReading({...current,note:String(note||'')});
}

export async function buildJournalBackup(){
  const readings=await listReadings();
  return {
    schema:BACKUP_SCHEMA,
    version:BACKUP_VERSION,
    exportedAt:new Date().toISOString(),
    readings,
  };
}

export function validateJournalBackup(value){
  if(!value||typeof value!=='object') throw new Error('Backup must be a JSON object.');
  if(value.schema!==BACKUP_SCHEMA) throw new Error('This is not a Palimpsest journal backup.');
  if(value.version!==BACKUP_VERSION) throw new Error(`Unsupported backup version: ${value.version}.`);
  if(!Array.isArray(value.readings)) throw new Error('Backup readings are missing.');
  for(const [index,reading] of value.readings.entries()){
    if(!reading||typeof reading!=='object') throw new Error(`Reading ${index+1} is invalid.`);
    if(typeof reading.id!=='string'||!reading.id) throw new Error(`Reading ${index+1} has no valid id.`);
    if(typeof reading.createdAt!=='string') throw new Error(`Reading ${index+1} has no valid date.`);
    if(!Array.isArray(reading.cards)||reading.cards.length!==3) throw new Error(`Reading ${index+1} must contain exactly three cards.`);
    if(!Array.isArray(reading.positions)||reading.positions.length!==3) throw new Error(`Reading ${index+1} has invalid positions.`);
  }
  return true;
}

export async function restoreJournalBackup(value,{mode='merge'}={}){
  validateJournalBackup(value);
  if(!['merge','replace'].includes(mode)) throw new Error('Restore mode must be merge or replace.');
  const readings=value.readings.map(sanitizeSnapshot);
  await tx('readwrite',(store)=>{
    if(mode==='replace') store.clear();
    readings.forEach((reading)=>store.put(reading));
  });
  return readings.length;
}
