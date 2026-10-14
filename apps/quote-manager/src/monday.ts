import mondaySdk from 'monday-sdk-js';
import {createMondayAdapter} from './adapter.ts';
import type {Transport} from './adapter.ts';
export const monday=mondaySdk();
export const liveAdapter=createMondayAdapter(async(query,variables)=>await monday.api(query,{variables,apiVersion:'2026-07'}) as Awaited<ReturnType<Transport>>,import.meta.env.VITE_MONDAY_WRITES_ENABLED==='true');
let preferenceKey='';
export async function confirmContext() {
 const context=await Promise.race([monday.get('context'),new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error('Monday session context timed out. Open the installed private board view.')),8000))]);
 if(String((context.data as {boardId?:number})?.boardId)!=='5031824429') throw new Error('Open Quote Builder on the private Quotations Prototype board.');
 const userId=String((context.data as {user?:{id?:string}})?.user?.id??'');
 preferenceKey=userId?`quote-builder:autosave:user:${userId}`:'';
}
export async function readAutosavePreference():Promise<boolean|null> {
 if(!preferenceKey)return null;
 const response=await monday.storage.instance.getItem(preferenceKey);
 if(response.errorMessage||!response.data?.success)throw new Error(response.errorMessage||'Autosave preference could not be read from Monday.');
 return response.data.value===null||response.data.value===undefined?null:response.data.value===true||response.data.value==='true';
}
export async function writeAutosavePreference(enabled:boolean):Promise<void> {
 if(!preferenceKey)throw new Error('Monday user identity is unavailable for the Autosave preference.');
 const response=await monday.storage.instance.setItem(preferenceKey,String(enabled));
 if(response.errorMessage||!response.data?.success)throw new Error(response.errorMessage||'Autosave preference could not be stored in Monday.');
}
