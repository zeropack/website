// Read-only integration check. Run outside Vite; never bundle credentials into the application.
import assert from 'node:assert/strict';
import {createMondayAdapter,FIRST_QUERY,NEXT_QUERY} from '../src/adapter.ts';
import {QUOTE_BOARD_ID,COMPANY_BOARD_ID,CONTACT_BOARD_ID,DEAL_BOARD_ID,PROJECT_BOARD_ID} from '../src/schema.ts';
const token=process.env.MONDAY_API_TOKEN;
if(!token)throw new Error('Provide MONDAY_API_TOKEN securely in the process environment, never as a Vite variable.');
const transport=async(query,variables)=>{
 if(!query.trim().startsWith('query'))throw new Error('Read-only checker rejects mutations.');
 const response=await fetch('https://api.monday.com/v2',{method:'POST',headers:{Authorization:token,'Content-Type':'application/json','API-Version':'2026-07'},body:JSON.stringify({query,variables})});
 if(!response.ok)throw new Error(`Monday HTTP ${response.status}`);
 const body=await response.json();if(body.errors?.length)throw new Error(body.errors.map(e=>e.message).join('; '));return body;
};
const adapter=createMondayAdapter(transport);
await adapter.fetchColumns();
for(const id of [QUOTE_BOARD_ID,COMPANY_BOARD_ID,CONTACT_BOARD_ID,DEAL_BOARD_ID,PROJECT_BOARD_ID]){
 const first=await transport(FIRST_QUERY,{ids:[String(id)],limit:1});const board=first.data.boards.find(b=>b.id===String(id));assert.ok(board,`Board ${id} unavailable`);
 if(board.items_page.cursor){const next=await transport(NEXT_QUERY,{cursor:board.items_page.cursor,limit:1});assert.ok(Array.isArray(next.data.next_items_page.items));}
 console.log(`Board ${id}: first and available next page verified`);
}
console.log('Read-only integration check passed on Monday API 2026-07');
