import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { BlobNotFoundError, get, put } from '@vercel/blob';
import type { Snapshot, SymbolName } from './types';
export const persistenceMode=()=>process.env.BLOB_READ_WRITE_TOKEN?'DURABLE · VERCEL BLOB':process.env.VERCEL?'UNAVAILABLE · HISTORY NOT SAVED':'LOCAL JSON';
const fileFor=(symbol:SymbolName)=>path.join(process.cwd(),'.diverge',`${symbol}.json`);
interface Stored { snapshots:Snapshot[]; etag?:string }
export async function readHistory(symbol:SymbolName):Promise<Stored> {
 if(process.env.BLOB_READ_WRITE_TOKEN){
  try{
   const data=await get(`diverge/v1/${symbol}.json`,{access:'private',useCache:false,headers:{'Accept-Encoding':'identity'}});
   if(!data)return {snapshots:[]};
   if(data.statusCode!==200)throw new Error('Snapshot store returned no content');
   return {snapshots:JSON.parse(await new Response(data.stream).text()),etag:data.blob.etag};
  }catch(error){
   if(error instanceof BlobNotFoundError)return {snapshots:[]};
   throw error;
  }
 }
 if(process.env.VERCEL)return {snapshots:[]};
 try{return {snapshots:JSON.parse(await readFile(fileFor(symbol),'utf8'))};}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return {snapshots:[]};throw error;}
}
export async function saveSnapshot(snapshot:Snapshot, stored:Stored):Promise<boolean> {
 const snapshots=[snapshot,...stored.snapshots].slice(0,100);
 if(process.env.BLOB_READ_WRITE_TOKEN){
  // Conditional writes prevent two instances overwriting one another's history.
  await put(`diverge/v1/${snapshot.symbol}.json`,JSON.stringify(snapshots),{access:'private',addRandomSuffix:false,contentType:'application/json',cacheControlMaxAge:60,...(stored.etag?{ifMatch:stored.etag,allowOverwrite:true}:{allowOverwrite:false})});
  return true;
 }
 if(process.env.VERCEL)return false;
 await mkdir(path.dirname(fileFor(snapshot.symbol)),{recursive:true});
 const tmp=fileFor(snapshot.symbol)+'.'+randomUUID()+'.tmp';
 await writeFile(tmp,JSON.stringify(snapshots));await rename(tmp,fileFor(snapshot.symbol));return true;
}
