import test from 'node:test';
import assert from 'node:assert/strict';
import {createMondayAdapter,decode,columnOptions,toValues,duplicateDraft,validateDraft,FIRST_QUERY,NEXT_QUERY,COLUMN_QUERY,type Item,type Transport} from '../src/adapter.ts';
import {C,blank,QUOTE_BOARD_ID} from '../src/schema.ts';
import {demoDraft,createMockAdapter} from '../src/mock.ts';
const item=(id='1'):Item=>({id,name:'TEST quote',updated_at:'2026-10-10',column_values:[]});
const columns=Object.values(C).map(id=>({id,type:'text',settings_str:'{}'}));
const metadata={boards:[{id:String(QUOTE_BOARD_ID),board_kind:'private',columns}]};
test('relations survive null generic values and use typed IDs',()=>{
 const d=decode({...item(),column_values:[{id:C.company,type:'board_relation',value:null,text:null,linked_item_ids:['2757837247']}]});assert.equal(d.values.company,'2757837247');
});
test('dropdown decoder uses typed labels without splitting comma-containing names',()=>{
 const d=decode({...item(),column_values:[{id:C.supplierDropdown,type:'dropdown',value:'{"ids":[1]}',text:null,values:[{id:1,label:'Example, Ltd.'}]}]});assert.equal(d.values.supplierDropdown,'Example, Ltd.');
});
test('multiple relations fail rather than erase data on save',()=>{
 assert.throws(()=>decode({...item(),column_values:[{id:C.company,type:'board_relation',value:null,text:null,linked_item_ids:['1','2']}]}),/multiple links/);
});
test('dropdown mappings support name, label and status dictionary; remove deactivated labels',()=>{
 const opts=columnOptions([{id:'a',type:'dropdown',settings_str:'{"labels":[{"id":1,"name":"A"},{"id":2,"label":"B"}],"deactivated_labels":[2]}'},{id:'s',type:'status',settings_str:'{"labels":{"0":"Draft","1":"Issued"}}'}]);assert.deepEqual(opts,{a:['A'],s:['Draft','Issued']});
});
test('paginates references through root-level next_items_page with ID strings',async()=>{
 const calls:{query:string;variables:Record<string,unknown>}[]=[];
 const a=createMondayAdapter(async(query,variables)=>{calls.push({query,variables});return {data:calls.length===1?{boards:[{id:'5029468199',items_page:{cursor:'cursor1',items:[item('1')]}}]}:{next_items_page:{cursor:null,items:[item('2')]}}}});
 assert.equal((await a.loadRefs(5029468199)).length,2);assert.match(calls[0].query,/column_values\(ids:/);assert.deepEqual(calls[0].variables,{ids:['5029468199'],limit:100});assert.match(calls[1].query,/next_items_page/);assert.equal(calls[1].variables.cursor,'cursor1');
});
test('missing board cannot masquerade as an empty board',async()=>{await assert.rejects(createMondayAdapter(async()=>({data:{boards:[]}})).loadQuotes(),/unavailable/)});
test('repeated cursor rejects partial results',async()=>{let calls=0;const a=createMondayAdapter(async()=>({data:++calls===1?{boards:[{id:String(QUOTE_BOARD_ID),items_page:{cursor:'x',items:[]}}]}:{next_items_page:{cursor:'x',items:[]}}}));await assert.rejects(a.loadQuotes(),/repeated cursor/)});
test('GraphQL partial errors are surfaced',async()=>{await assert.rejects(createMondayAdapter(async()=>({data:{boards:[]},errors:[{message:'Permission denied'}]})).loadQuotes(),/Permission denied/)});
test('private board and known schema are required',async()=>{await assert.rejects(createMondayAdapter(async()=>({data:{boards:[{...metadata.boards[0],board_kind:'public'}]}})).fetchColumns(),/private/)});
test('writes disabled by default',async()=>{await assert.rejects(createMondayAdapter(async()=>({data:{}})).saveQuote(demoDraft()),/disabled/)});
test('duplicate clears external/legacy IDs and visibility',()=>{const d=duplicateDraft({...demoDraft(),qboId:'secret',qboUrl:'private',legacy:'4',status:'Issued',visibility:'Published'});assert.equal(d.status,'Draft');assert.equal(d.visibility,'Private');assert.equal(d.qboId,'');assert.equal(d.qboUrl,'');assert.equal(d.legacy,'')});
test('save serialization preserves snapshot and omits managed external fields',()=>{const d=demoDraft();const v=toValues(d,true);assert.equal(v[C.fx],'1.5');assert.deepEqual(v[C.visibility],{label:'Private'});assert.ok(!(C.qboId in v));assert.ok(!(C.legacy in v));assert.deepEqual(v[C.company],{item_ids:[101]});assert.deepEqual(toValues({...d,company:'',packaging:''})[C.company],{item_ids:[]});assert.deepEqual(toValues({...d,packaging:''})[C.packaging],{ids:[]})});
test('reject invalid numbers, negative values, fractional quantities and zero FX',()=>{for(const patch of [{usdUnit:'NaN'},{shipping:'-1'},{quantity:'1.5'},{fx:'0'},{bank:'Infinity'}])assert.throws(()=>validateDraft({...demoDraft(),...patch}))});
test('fresh quote creation is private and scoped to prototype board',async()=>{let vars:Record<string,unknown>={};const a=createMondayAdapter(async(q,v)=>{if(q===COLUMN_QUERY)return {data:metadata};vars=v;return {data:{create_item:{id:'22'}}}},true);assert.equal(await a.saveQuote(demoDraft()),'22');assert.equal(vars.board,String(QUOTE_BOARD_ID));assert.equal(JSON.parse(String(vars.vals))[C.visibility].label,'Private')});
test('locked original blocks save even if draft status changed',async()=>{let mutations=0;const a=createMondayAdapter(async(q)=>{if(q===COLUMN_QUERY)return {data:metadata};if(q.startsWith('mutation'))mutations++;return {data:{items:[{...item(),board:{id:String(QUOTE_BOARD_ID)},column_values:[{id:C.status,type:'status',value:null,text:'Issued'}]}]}}},true);await assert.rejects(a.saveQuote(demoDraft(),'1','2026-10-10'),/locked/);assert.equal(mutations,0)});
test('stale quotation cannot overwrite current record',async()=>{const a=createMondayAdapter(async(q)=>({data:q===COLUMN_QUERY?metadata:{items:[{...item(),board:{id:String(QUOTE_BOARD_ID)},column_values:[{id:C.status,type:'status',value:null,text:'Draft'}]}]}}),true);await assert.rejects(a.saveQuote(demoDraft(),'1','old'),/changed in Monday/)});
test('mock draft save and reopen preserves manual descriptions and snapshot',async()=>{const a=createMockAdapter();const d={...demoDraft(),customerDesc:'Edited exact wording',fx:'1.54321'};const id=await a.saveQuote(d);const reopened=(await a.loadQuotes()).find(q=>q.id===id)!;assert.equal(reopened.values.customerDesc,d.customerDesc);assert.equal(reopened.values.fx,d.fx)});

test('customer reference decoding retains verified contact links and canonical address',async()=>{
 const {decodeRef}=await import('../src/adapter.ts');
 const r=decodeRef({...item('11'),column_values:[{id:'board_relation_mm4nz01g',type:'board_relation',value:null,text:null,linked_item_ids:['22']},{id:'location_mm4nwpvd',type:'location',value:null,text:'10 Example Street, Adelaide SA 5000'},{id:'contact_email',type:'email',value:null,text:'person@example.com'},{id:'text_mm5n6d0w',type:'text',value:null,text:'Test'}]});
 assert.deepEqual(r.primaryContactIds,['22']);assert.equal(r.shippingAddress,'10 Example Street, Adelaide SA 5000');assert.equal(r.email,'person@example.com');assert.equal(r.firstName,'Test');assert.equal(r.businessAddress,'');
});
test('company selection uses only a verified primary or unique linked contact',async()=>{
 const {companyContact}=await import('../src/customer.ts');
 const company=[{id:'1',name:'Test',primaryContactIds:['3']}],contacts=[{id:'2',name:'One',companyIds:['1']},{id:'3',name:'Two',companyIds:['1']}];
 assert.equal(companyContact('1',company,contacts),'3');assert.equal(companyContact('1',[{id:'1',name:'Test'}],contacts),'');assert.equal(companyContact('1',company,[{id:'3',name:'Wrong company',companyIds:['9']}]),'');assert.equal(companyContact('1',company,[contacts[0]]),'2');
});
