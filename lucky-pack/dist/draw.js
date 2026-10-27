import { fortunes } from './fortunes.js';

function sessionStore(){
  try{return globalThis.sessionStorage || null;}catch{return null;}
}

// A shuffled bag is shared by every pack. Opening, not selecting, consumes a draw.
// The session stores only the remaining IDs, never a visible collection/history.
export function createFortuneDraw({pool=fortunes,random=Math.random,storage=sessionStore(),key='lucky-pack-draw-v1'}={}){
  if(pool.length<2)throw new Error('At least two fortunes are required.');
  const byId=new Map(pool.map(f=>[f.id,f]));
  if(byId.size!==pool.length)throw new Error('Fortune IDs must be unique.');
  const ids=[...byId.keys()];
  const poolKey=ids.join('|');
  let remaining=[];
  let last=null;
  try{
    const state=JSON.parse(storage?.getItem(key)||'null');
    if(state&&state.poolKey===poolKey&&Array.isArray(state.remaining)&&state.remaining.every(id=>byId.has(id))&&new Set(state.remaining).size===state.remaining.length&&byId.has(state.last)&&!state.remaining.includes(state.last)){
      remaining=[...state.remaining];last=state.last;
    }
  }catch{}
  function refill(){
    remaining=[...ids];
    for(let i=remaining.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[remaining[i],remaining[j]]=[remaining[j],remaining[i]];}
    // Avoid an immediate repeat even at the boundary between two full bags.
    const end=remaining.length-1;
    if(remaining[end]===last)[remaining[0],remaining[end]]=[remaining[end],remaining[0]];
  }
  return function draw(){
    if(!remaining.length)refill();
    last=remaining.pop();
    try{storage?.setItem(key,JSON.stringify({poolKey,remaining,last}));}catch{}
    return byId.get(last);
  };
}
