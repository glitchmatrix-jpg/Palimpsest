export function detectGraphicsMode(){
  const params=new URLSearchParams(globalThis.location?.search||'');
  const forced=params.get('graphics');
  if(forced==='off') return 'off';
  if(forced==='low') return 'low';

  try{
    const canvas=document.createElement('canvas');
    const gl=canvas.getContext('webgl2',{failIfMajorPerformanceCaveat:true})||canvas.getContext('webgl',{failIfMajorPerformanceCaveat:true})||canvas.getContext('experimental-webgl',{failIfMajorPerformanceCaveat:true});
    if(!gl) return 'off';
  }catch{return 'off';}

  const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if(reduced) return 'low';
  const memory=Number(globalThis.navigator?.deviceMemory||0);
  const cores=Number(globalThis.navigator?.hardwareConcurrency||0);
  if((memory&&memory<=4)||(cores&&cores<=4)) return 'low';
  return 'full';
}
