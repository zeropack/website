import mondaySdk from 'monday-sdk-js';
import {createMondayAdapter} from './adapter.ts';
import type {Transport} from './adapter.ts';
export const monday=mondaySdk();
export const liveAdapter=createMondayAdapter(async(query,variables)=>await monday.api(query,{variables,apiVersion:'2026-07'}) as Awaited<ReturnType<Transport>>,import.meta.env.VITE_MONDAY_WRITES_ENABLED==='true');
export async function confirmContext() {
 const context=await Promise.race([monday.get('context'),new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error('Monday session context timed out. Open the installed private board view.')),8000))]);
 if(String((context.data as {boardId?:number})?.boardId)!=='5031824429') throw new Error('Open Quote Builder on the private Quotations Prototype board.');
}
