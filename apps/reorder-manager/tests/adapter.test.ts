import test from 'node:test';
import assert from 'node:assert/strict';
import {createAdapter} from '../src/adapter.ts';
import {templates,fixture} from '../src/mock.ts';
import {BOARD,TEMPLATES,COMPANIES,CONTACTS,PROJECTS,C,T,SNAPSHOT,DRAFT_BODY,WRITABLE} from '../src/schema.ts';
type Row={id:string;name:string;updated_at:string;board:{id:string};column_values:any[]};
function harness(qaMode=false){
 const p=fixture();let mutations=0,revision=1,contact='201',failMutation=false;
 const row=(id:string,board:string,name:string,values:Record<string,unknown>):Row=>({id,name,board:{id:board},updated_at:'r1',column_values:Object.entries(values).map(([id,v])=>({id,text:Array.isArray(v)?null:v,linked_item_ids:Array.isArray(v)?v:undefined}))});
 const profile=row(qaMode?'2889840324':'1',BOARD,'Demo',{[C.company]:['101'],[C.kind]:'Verified Profile',[C.product]:p.product,[C.key]:'company|paired',[C.last]:p.last,[C.quantity]:'4000',[C.typical]:'100',[C.confidence]:'Medium',[C.active]:'Yes',[C.review]:'Ready for Review',[C.snooze]:'',[C.issues]:'',[C.evidence]:'',[C.cycle]:'one',[C.lastProject]:[],[C.previousProject]:[],[SNAPSHOT]:'',[DRAFT_BODY]:'',[C.draftState]:'Empty'});
 if(qaMode){profile.column_values.find(x=>x.id===C.kind).text='QA';profile.column_values.find(x=>x.id===C.company).linked_item_ids=[];}
 const company=row('101',COMPANIES,'Demo Company',{'board_relation_mm4nz01g':['201']});
 const contacts=['201','202'].map((id,i)=>row(id,CONTACTS,'Contact '+id,{'text_mm5n6d0w':i?'New':'Alex','text_mm4pxvbs':'Taylor','contact_email':i?'new@example.invalid':'alex@example.invalid','contact_account':['101']}));
 const templateRows=templates.map(t=>row(t.id,TEMPLATES,t.name,{[T.key]:t.key,[T.subject]:t.subject,[T.body]:t.body,[T.footer]:t.footer,[T.active]:'Yes',[T.version]:t.version,[T.component]:t.component,[T.process]:'Reorder'}));
 const schema=(id:string)=>id===BOARD?{[SNAPSHOT]:'text',[DRAFT_BODY]:'long_text',[C.draftState]:'status',[C.active]:'status',[C.review]:'status',[C.company]:'board_relation'}:id===TEMPLATES?{[T.key]:'text',[T.body]:'long_text',[T.component]:'status'}:{project_status:'status',project_timeline:'timeline'};
 const calls:{query:string;variables:any}[]=[];
 const adapter=createAdapter(async(query,variables:any={})=>{
  calls.push({query,variables});
  if(query.startsWith('mutation')){mutations++;if(failMutation)return {errors:[{message:'Write rejected'}]};const values=JSON.parse(variables.values);assert.equal(variables.board,BOARD);for(const [id,v]of Object.entries(values)){assert.ok(WRITABLE.has(id));assert.notEqual(id,C.confidence);assert.equal(variables.item,profile.id);const cell=profile.column_values.find(x=>x.id===id);cell.text=v===null?'':typeof v==='string'?v:(v as any).text??(v as any).label??(v as any).date??'';}profile.updated_at='r'+(++revision);return {data:{change_multiple_column_values:{id:'1'}}};}
  if(query.includes('me{id'))return {data:{me:{id:'reviewer-1',name:'Demo reviewer',email:'qa@zeropack.co'}}};
  if(query.includes('boards(ids:')){const id=variables.id[0],rows=id===BOARD?[profile]:id===TEMPLATES?templateRows:[];return {data:{boards:[{id,columns:Object.entries(schema(id)).map(([id,type])=>({id,type,title:id})),items_page:{cursor:null,items:structuredClone(rows)}}]}};}
  company.column_values[0].linked_item_ids=[contact];
  return {data:{items:variables.ids.map((id:string)=>[profile,company,...contacts].find(r=>r.id===id)).filter(Boolean).map((r:Row)=>structuredClone(r))}};
 });
 return {adapter,profile,calls,mutations:()=>mutations,changeContact:()=>{contact='202'},fail:()=>{failMutation=true}};
}
test('Full preview → edit → approve uses live contact and only profile columns',async()=>{const h=harness();let d=await h.adapter.load(),p=d.profiles[0];assert.equal(p.contact?.email,'alex@example.invalid');d=await h.adapter.save(p.id,p.updatedAt,'Generate',null);p=d.profiles[0];assert.ok(p.snapshot);const canonical=JSON.stringify(d.templates);d=await h.adapter.save(p.id,p.updatedAt,'Edit',p.snapshot,{subject:'Customer edit',body:'Hi Alex,\n\nOnly this review.'});p=d.profiles[0];assert.equal(p.snapshot?.edited,true);assert.equal(JSON.stringify(d.templates),canonical);d=await h.adapter.save(p.id,p.updatedAt,'Approve',p.snapshot);assert.equal(d.profiles[0].snapshot?.approvedBy,'reviewer-1');assert.equal(d.profiles[0].review,'Approved');assert.equal(d.profiles[0].confidence,'Medium');assert.equal(h.mutations(),3);assert.ok(h.calls.filter(x=>x.query.startsWith('mutation')).every(x=>!x.query.includes('send')))});
test('Contact changes reject approval without writes',async()=>{const h=harness();let d=await h.adapter.load(),p=d.profiles[0];d=await h.adapter.save(p.id,p.updatedAt,'Generate',null);p=d.profiles[0];h.changeContact();await assert.rejects(h.adapter.save(p.id,p.updatedAt,'Approve',p.snapshot),/Needs Refresh/);assert.equal(h.mutations(),1)});
test('Concurrent profile update rejects stale save',async()=>{const h=harness(),d=await h.adapter.load();h.profile.updated_at='external';await assert.rejects(h.adapter.save('1',d.profiles[0].updatedAt,'Generate',null),/changed/);assert.equal(h.mutations(),0)});
test('API errors do not report approval success or retry mutations',async()=>{const h=harness(),d=await h.adapter.load();h.fail();await assert.rejects(h.adapter.save('1',d.profiles[0].updatedAt,'Generate',null),/rejected/);assert.equal(h.mutations(),1)});
test('Pause is persistent and no automatic reactivation is written',async()=>{const h=harness(),d=await h.adapter.load(),result=await h.adapter.save('1',d.profiles[0].updatedAt,'Pause',null);assert.equal(result.profiles[0].active,false);assert.equal(result.profiles[0].review,'Paused');await assert.rejects(h.adapter.save('1',result.profiles[0].updatedAt,'Generate',null),/paused/);assert.equal(h.mutations(),1)});
test('A stale approved preview can be refreshed and its old approval revoked',async()=>{const h=harness();let d=await h.adapter.load(),p=d.profiles[0];d=await h.adapter.save('1',p.updatedAt,'Generate',null);p=d.profiles[0];d=await h.adapter.save('1',p.updatedAt,'Approve',p.snapshot);p=d.profiles[0];h.changeContact();d=await h.adapter.save('1',p.updatedAt,'Generate',p.snapshot);assert.equal(d.profiles[0].snapshot?.recipient.email,'new@example.invalid');assert.equal(d.profiles[0].snapshot?.approvedAt,null);assert.equal(d.profiles[0].review,'Ready for Review')});

test('Installed QA lifecycle writes only the excluded fixture, preserving templates and customer-mode exclusion',async()=>{
 const h=harness(true);assert.equal((await h.adapter.load()).profiles.length,0);
 let d=await h.adapter.prepareQa(true),p=d.profiles[0];assert.equal(p.isQa,true);
 const canonical=JSON.stringify(d.templates);
 d=await h.adapter.save(p.id,p.updatedAt,'Generate',null,{qaMode:true});p=d.profiles[0];assert.ok(p.snapshot);
 d=await h.adapter.save(p.id,p.updatedAt,'Edit',p.snapshot,{qaMode:true,subject:'Internal QA only',body:'Internal instance edit'});p=d.profiles[0];
 d=await h.adapter.save(p.id,p.updatedAt,'Approve',p.snapshot,{qaMode:true});p=d.profiles[0];assert.equal(p.review,'Approved');
 assert.equal((await h.adapter.load(true)).profiles[0].snapshot?.body,'Internal instance edit');
 assert.equal(JSON.stringify(d.templates),canonical);
 d=await h.adapter.save(p.id,p.updatedAt,'Snooze',p.snapshot,{qaMode:true,date:'2099-01-01'});assert.equal(d.profiles[0].review,'Snoozed');
 d=await h.adapter.prepareQa(true);p=d.profiles[0];d=await h.adapter.save(p.id,p.updatedAt,'Skip',null,{qaMode:true});assert.equal(d.profiles[0].review,'Skipped');
 d=await h.adapter.prepareQa(true);p=d.profiles[0];d=await h.adapter.save(p.id,p.updatedAt,'Pause',null,{qaMode:true});assert.equal(d.profiles[0].active,false);
 d=await h.adapter.prepareQa(false);assert.equal(d.profiles[0].snapshot,null);assert.equal(d.profiles[0].active,false);assert.equal(d.profiles[0].review,'Not Ready');
 assert.equal((await h.adapter.load()).profiles.length,0);
 await assert.rejects(h.adapter.save('1','r1','Generate',null,{qaMode:true}),/changed/);
});
