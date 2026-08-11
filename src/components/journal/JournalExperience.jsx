import { useEffect, useMemo, useRef, useState } from 'react';
import { buildJournalBackup, deleteReading, listReadings, restoreJournalBackup, updateReadingNote } from '../../storage/journalStore.js';

const asset=(path)=>`${import.meta.env.BASE_URL}${path}`;

function dateLabel(value){
  const date=new Date(value);
  if(Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(date);
}
function timeLabel(value){
  const date=new Date(value);
  if(Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'}).format(date);
}
function cardLine(reading){ return (reading.cards||[]).map((card)=>card.name).join(' · '); }

function JournalEmpty(){
  return <div className="journal-empty"><span>○</span><h2>No saved readings yet.</h2><p>When a reading matters, save it from Read. Palimpsest stores the finished interpretation and your note locally in this browser.</p></div>;
}

function ArchiveItem({reading,active,onOpen}){
  return <button type="button" className={`journal-item ${active?'is-active':''}`} onClick={onOpen}>
    <span>{dateLabel(reading.createdAt)}</span>
    <strong>{reading.spreadName||reading.positions?.join(' · ')}</strong>
    <p>{cardLine(reading)}</p>
    {reading.question&&<small>“{reading.question}”</small>}
  </button>;
}

function ReadingDetail({reading,onDeleted,onUpdated}){
  const [note,setNote]=useState(reading.note||'');
  const [status,setStatus]=useState('');
  useEffect(()=>{setNote(reading.note||'');setStatus('');},[reading.id]);

  const saveNote=async()=>{
    setStatus('Saving…');
    try{const updated=await updateReadingNote(reading.id,note);onUpdated(updated);setStatus('Saved');}
    catch(error){setStatus(error.message||'Could not save note.');}
  };
  const remove=async()=>{
    if(!globalThis.confirm?.('Delete this saved reading? This cannot be undone unless it exists in a backup.')) return;
    await deleteReading(reading.id);onDeleted(reading.id);
  };

  return <article className="journal-detail">
    <header><div><span>{dateLabel(reading.createdAt)} · {timeLabel(reading.createdAt)}</span><h2>{reading.spreadName||reading.positions?.join(' · ')}</h2>{reading.question&&<p>“{reading.question}”</p>}</div><button type="button" className="journal-delete" onClick={remove}>Delete</button></header>

    <div className="journal-detail__cards">{(reading.cards||[]).map((card,index)=><div key={`${card.id}-${index}`}><div className={card.orientation==='reversed'?'is-reversed':''}><img src={asset(card.image)} alt={card.name}/></div><span>{reading.positions?.[index]} · {card.orientation}</span><strong>{card.name}</strong><small>{(card.keywords||[]).slice(0,3).join(' · ')}</small></div>)}</div>

    <section className="journal-section"><span>THE CARDS</span>{(reading.cards||[]).map((card,index)=><div className="journal-card-reading" key={`${card.id}-reading`}><strong>{reading.positions?.[index]} — {card.name}{card.orientation==='reversed'?' reversed':''}</strong><p>{card.reading}</p></div>)}</section>

    {(reading.relations||[]).some((item)=>item.interesting)&&<section className="journal-section"><span>THE THREAD</span>{reading.relations.filter((item)=>item.interesting).map((item,index)=><div className="journal-thread" key={`${item.type}-${index}`}><strong>{item.axis}</strong><p>{item.text}</p></div>)}</section>}

    {reading.layers?.length>0&&<section className="journal-section"><span>THE LAYERS</span>{reading.layers.map((layer)=><div className="journal-layer" key={layer.id||layer.title}><strong>{layer.title}</strong><p>{layer.text}</p></div>)}</section>}

    <section className="journal-section"><span>OVERALL READING</span><h3>{reading.summary}</h3>{(reading.synthesis||[]).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</section>

    {reading.reflection?.length>0&&<section className="journal-section"><span>REFLECTION</span><ol className="journal-reflection">{reading.reflection.map((item)=><li key={item}>{item}</li>)}</ol></section>}

    <section className="journal-note"><label><span>YOUR NOTE</span><textarea rows="7" value={note} onChange={(event)=>setNote(event.target.value)} placeholder="What actually resonated? What happened afterward? What do you want to remember?"/></label><div><small>{status}</small><button type="button" onClick={saveNote}>Save note</button></div></section>
  </article>;
}

export default function JournalExperience(){
  const [readings,setReadings]=useState([]);
  const [selectedId,setSelectedId]=useState(null);
  const [query,setQuery]=useState('');
  const [status,setStatus]=useState('');
  const fileRef=useRef(null);

  const load=async()=>{
    try{const items=await listReadings();setReadings(items);setSelectedId((current)=>items.some((item)=>item.id===current)?current:(items[0]?.id||null));}
    catch(error){setStatus(error.message||'Could not open the local journal.');}
  };
  useEffect(()=>{load();},[]);

  const visible=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q) return readings;
    return readings.filter((reading)=>[reading.spreadName,reading.question,reading.note,cardLine(reading),...(reading.synthesis||[]),...(reading.cards||[]).map((card)=>card.reading)].filter(Boolean).join(' ').toLowerCase().includes(q));
  },[readings,query]);
  const selected=readings.find((item)=>item.id===selectedId)||null;

  const exportBackup=async()=>{
    try{
      const backup=await buildJournalBackup();
      const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob);
      const link=document.createElement('a');
      link.href=url;link.download=`palimpsest-journal-${new Date().toISOString().slice(0,10)}.json`;link.click();
      URL.revokeObjectURL(url);setStatus(`Exported ${backup.readings.length} reading${backup.readings.length===1?'':'s'}.`);
    }catch(error){setStatus(error.message||'Export failed.');}
  };

  const restore=async(event)=>{
    const file=event.target.files?.[0];event.target.value='';if(!file)return;
    try{
      const parsed=JSON.parse(await file.text());
      const replace=globalThis.confirm?.('Restore mode:\n\nOK = REPLACE this browser’s journal with the backup.\nCancel = MERGE the backup with existing readings.');
      const mode=replace?'replace':'merge';
      const count=await restoreJournalBackup(parsed,{mode});
      await load();setStatus(`${mode==='replace'?'Restored':'Merged'} ${count} reading${count===1?'':'s'}.`);
    }catch(error){setStatus(error.message||'Restore failed.');}
  };

  const handleDeleted=(id)=>{setReadings((items)=>items.filter((item)=>item.id!==id));setSelectedId((current)=>current===id?null:current);setTimeout(load,0);};
  const handleUpdated=(updated)=>setReadings((items)=>items.map((item)=>item.id===updated.id?updated:item));

  return <div className="journal-experience">
    <div className="journal-toolbar"><label><span>SEARCH JOURNAL</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Card, spread, question, note…"/></label><div><button type="button" onClick={exportBackup}>Export JSON</button><button type="button" onClick={()=>fileRef.current?.click()}>Restore JSON</button><input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={restore}/></div></div>
    {status&&<p className="journal-status" role="status">{status}</p>}

    {!readings.length?<JournalEmpty/>:<div className="journal-layout"><aside className="journal-archive"><div><span>{visible.length} OF {readings.length}</span><strong>Reading archive</strong></div>{visible.map((reading)=><ArchiveItem key={reading.id} reading={reading} active={reading.id===selectedId} onOpen={()=>setSelectedId(reading.id)}/>)}{!visible.length&&<p className="journal-no-results">No saved reading matches that search.</p>}</aside><main>{selected?<ReadingDetail reading={selected} onDeleted={handleDeleted} onUpdated={handleUpdated}/>:<JournalEmpty/>}</main></div>}
  </div>;
}
