'use client';
import type {CSSProperties} from 'react';
import type {Check} from '@/lib/types';
import {shortHash} from './primitives';
interface Props {loading:boolean;scannedAt?:string;hash?:string;checks:Check[];assetCount:number;persistence?:string;error?:string|null}
const lanes=[{id:'supply',name:'SOLANA RPC',kind:'ONCHAIN',y:25},{id:'mark',name:'PRESTOCKS API',kind:'ISSUER',y:74},{id:'jupiter',name:'JUPITER QUOTE',kind:'MARKET',y:124},{id:'lifecycle',name:'ISSUER DISCLOSURES',kind:'CURATED',y:173}];
export function EvidenceFlow({loading,scannedAt,hash,checks,assetCount,persistence,error}:Props){
 const available=(id:string)=>checks.some(c=>c.id===id && (id==='jupiter' ? c.current!==null&&(c.current as Record<string,unknown>).route!=='NO DATA' : c.current!==null));
 const saved=!!persistence&&!persistence.startsWith('UNAVAILABLE');
 const status=loading?'SCAN IN PROGRESS':error?'SCAN UNAVAILABLE':scannedAt?'LATEST SCAN':'AWAITING FIRST SCAN';
 return <section className="evidence-flow flow-moving" aria-label="Evidence flow"><div className="flow-heading"><h2>EVIDENCE FLOW <span className={loading?'rust':''}>{status}</span></h2></div>
 <div className="flow-body"><div className="flow-sources">{lanes.map((lane,index)=>{
 const observations=checks.filter(c=>c.id===lane.id);
 const count=observations.filter(c=>lane.id==='jupiter'?(c.current!==null&&(c.current as Record<string,unknown>).route!=='NO DATA'):lane.id==='lifecycle'?true:c.current!==null).length;
 const unknown=!loading&&count===0;
 return <div className={`flow-source ${unknown?'flow-no-data':''}`} key={lane.id} style={{'--lane-delay':`${index*.28}s`} as CSSProperties}><span className="flow-source-icon" aria-hidden="true">{['◈','≡','↗','◷'][index]}</span><div><strong>{lane.name}</strong><small>{loading?(lane.id==='lifecycle'?'REVIEWED TERMS':'REQUESTING…'):scannedAt?`${count}/${assetCount} ${lane.kind}`:'NO DATA'}</small></div><i className="flow-port" aria-hidden="true"/></div>;
 })}</div>
 <div className="flow-graph" aria-hidden="true"><svg viewBox="0 0 690 198" preserveAspectRatio="none"><g className="flow-wires">{lanes.map(l=><path key={l.id} d={`M 0 ${l.y} C 90 ${l.y} 120 99 235 99`}/>)}<path d="M 365 99 L 690 99"/></g>{lanes.map((l,i)=><circle key={l.id} r="3" className={`flow-packet lane-${i} ${!loading&&!available(l.id)?'flow-blocked':''}`} style={{offsetPath:`path('M 0 ${l.y} C 90 ${l.y} 120 99 235 99')`,animationDelay:`${i*.3}s`} as CSSProperties}/>)}<circle r="3" className="flow-packet flow-output" style={{offsetPath:"path('M 365 99 L 690 99')",animationDelay:'1.45s'} as CSSProperties}/></svg><div className="flow-checker"><div className="checker-frame"><span/><span/><span/></div><strong>DETERMINISTIC<br/>CHECKS</strong><small>CANONICALIZE / SHA-256</small></div></div>
 <div className="flow-receipt"><div className="receipt-top"><span className="receipt-icon" aria-hidden="true">▤</span><span>{loading?'ASSEMBLING':error?'NO NEW SNAPSHOT':scannedAt?saved?'SNAPSHOT SAVED':'NOT SAVED':'SNAPSHOT'}</span></div><strong>{hash?shortHash(hash):'NO DATA'}</strong><small>{loading?'Awaiting source responses':error?'See scan error above':scannedAt?'Evidence + field-level diff':'No fabricated observations'}</small></div></div>
 <div className="flow-caption"><span>Source evidence → deterministic checks → SHA-256 snapshot</span><span>Represents Diverge's scan pipeline, not asset transfers.</span></div></section>;
}
