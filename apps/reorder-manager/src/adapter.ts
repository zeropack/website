import {BOARD,TEMPLATES,COMPANIES,CONTACTS,PROJECTS,C,T,SNAPSHOT,DRAFT_BODY,WRITABLE} from './schema.ts';
import {blockReason,decide,editDraft,generate,merge,stale,today,uniqueTemplate} from './model.ts';
import type {Profile,Template,Project,Snapshot,Contact} from './model.ts';
import {encodeSnapshot,decodeSnapshot} from './codec.ts';
type CV={id:string;text?:string|null;value?:string|null;linked_item_ids?:string[]};
type Item={id:string;name:string;updated_at:string;board?:{id:string};column_values:CV[]};
type Result={data?:any;errors?:{message:string}[];error_message?:string};
export type Transport=(query:string,variables?:Record<string,unknown>)=>Promise<Result>;
const text=(i:Item,id:string)=>i.column_values.find(x=>x.id===id)?.text||'';
const links=(i:Item,id:string)=>i.column_values.find(x=>x.id===id)?.linked_item_ids||[];
const ids=(list:string[])=>{if(list.some(x=>!/^\d+$/.test(x)))throw new Error('Invalid canonical ID.');return [...new Set(list)];};
export function createAdapter(transport:Transport){
 async function api(q:string,v?:Record<string,unknown>){const r=await transport(q,v);if(r.errors?.length||r.error_message||!r.data)throw new Error(r.errors?.map(x=>x.message).join('; ')||r.error_message||'Monday returned no data.');return r.data;}
 async function board(id:string,required:Record<string,string>){
  const d=await api('query($id:[ID!]){boards(ids:$id){id columns{id title type} items_page(limit:500){cursor items{id name updated_at column_values{id text ... on BoardRelationValue{linked_item_ids}}}}}}',{id:[id]});
  const b=d.boards?.[0];if(!b||b.id!==id)throw new Error('Required private board is unavailable: '+id);
  for(const [col,type]of Object.entries(required)){if(!b.columns.some((c:any)=>c.id===col&&c.type===type))throw new Error('Board schema changed: '+col);}
  const items:Item[]=[...b.items_page.items];let cursor=b.items_page.cursor;const seen=new Set<string>();
  for(let n=0;cursor;n++){if(n>=20||seen.has(cursor))throw new Error('Incomplete paging; no data has been written.');seen.add(cursor);const next=await api('query($cursor:String!){next_items_page(cursor:$cursor,limit:500){cursor items{id name updated_at column_values{id text ... on BoardRelationValue{linked_item_ids}}}}}',{cursor});items.push(...next.next_items_page.items);cursor=next.next_items_page.cursor;}
  return items;
 }
 async function itemBatch(list:string[],expectedBoard:string){
  if(!list.length)return [] as Item[];const result:Item[]=[];
  for(let i=0;i<list.length;i+=100){const d=await api('query($ids:[ID!]){items(ids:$ids){id name updated_at board{id} column_values{id text ... on BoardRelationValue{linked_item_ids}}}}',{ids:ids(list.slice(i,i+100))});
   if(d.items.length!==new Set(list.slice(i,i+100)).size||d.items.some((x:Item)=>x.board?.id!==expectedBoard))throw new Error('A canonical linked record is inaccessible or points to the wrong board.');result.push(...d.items);}
  return result;
 }
 async function load(){
  const [rows,tr,pr,me]=await Promise.all([board(BOARD,{[SNAPSHOT]:'text',[DRAFT_BODY]:'long_text',[C.draftState]:'status',[C.active]:'status',[C.review]:'status',[C.company]:'board_relation'}),board(TEMPLATES,{[T.key]:'text',[T.body]:'long_text',[T.component]:'status'}),board(PROJECTS,{project_status:'status',project_timeline:'timeline'}),api('query{me{id name}}')]);
  const companyIds=ids(rows.flatMap(r=>links(r,C.company))),companies=await itemBatch(companyIds,COMPANIES);
  const contactIds=ids(companies.flatMap(r=>links(r,'board_relation_mm4nz01g'))),contacts=await itemBatch(contactIds,CONTACTS);
  const projects:Project[]=pr.map(r=>({id:r.id,name:r.name,status:text(r,'project_status'),end:text(r,'project_timeline').match(/\d{4}-\d{2}-\d{2}/g)?.at(-1)||'',companyIds:links(r,'board_relation_mm6471v8')})).sort((a,b)=>a.id.localeCompare(b.id));
  const templates:Template[]=tr.map(r=>({id:r.id,name:r.name,key:text(r,T.key),subject:text(r,T.subject),body:text(r,T.body),footer:text(r,T.footer),active:text(r,T.active)==='Yes',version:text(r,T.version),process:text(r,T.process),component:text(r,T.component)}));
  const profiles:Profile[]=rows.filter(r=>text(r,C.kind)!=='QA').map(r=>{
   const companyList=links(r,C.company),companyId=companyList.length===1?companyList[0]:'',company=companies.find(x=>x.id===companyId),primary=company?links(company,'board_relation_mm4nz01g'):[],contact=primary.length===1?contacts.find(x=>x.id===primary[0]):null;
   const email=contact?text(contact,'contact_email'):'',contactCompanies=contact?links(contact,'contact_account'):[];
   const contactIssue=primary.length!==1?(primary.length?'Multiple Primary Contacts are selected.':'No current Primary Contact is selected.'):!email||!/^\S+@\S+\.\S+$/.test(email)?'Current Primary Contact has no valid email.':contactCompanies.length&&!contactCompanies.includes(companyId)?'Primary Contact Company relation conflicts with this Company.':'';
   const resolved:Contact|null=contact&&!contactIssue?{id:contact.id,name:[text(contact,'text_mm5n6d0w'),text(contact,'text_mm4pxvbs')].filter(Boolean).join(' ')||contact.name,firstName:text(contact,'text_mm5n6d0w'),email}:null;
   const projectIds=links(r,C.lastProject),previousIds=links(r,C.previousProject);
   return {id:r.id,name:r.name,updatedAt:r.updated_at,companyId,companyName:company?.name||r.name,kind:text(r,C.kind),product:text(r,C.product),key:text(r,C.key),last:text(r,C.last),quantity:text(r,C.quantity),typical:Number(text(r,C.typical))||0,confidence:text(r,C.confidence),active:text(r,C.active)==='Yes',review:text(r,C.review),snooze:text(r,C.snooze),issues:text(r,C.issues),evidence:text(r,C.evidence),cycle:text(r,C.cycle),projectIds,previousIds,contact:resolved,contactIssue,projects:projects.filter(x=>x.companyIds.includes(companyId)||projectIds.includes(x.id)||previousIds.includes(x.id)),snapshot:decodeSnapshot(text(r,SNAPSHOT)),draftState:text(r,C.draftState)};
  });
  if(!me.me?.id)throw new Error('Current staff identity unavailable.');
  return {profiles,templates,actor:String(me.me.id)};
 }
 async function write(id:string,expectedUpdatedAt:string,values:Record<string,unknown>){
  if(Object.keys(values).some(x=>!WRITABLE.has(x)))throw new Error('Write outside Phase 2 allowlist.');
  const latest=await itemBatch([id],BOARD);if(latest[0].updated_at!==expectedUpdatedAt)throw new Error('This profile changed in Monday. Refresh before saving.');
  await api('mutation($board:ID!,$item:ID!,$values:JSON!){change_multiple_column_values(board_id:$board,item_id:$item,column_values:$values){id}}',{board:BOARD,item:id,values:JSON.stringify(values)});
  const verified=(await itemBatch([id],BOARD))[0];
  for(const [key,value]of Object.entries(values)){const expected=typeof value==='string'?value:(value as any)?.text??(value as any)?.label??(value as any)?.date??'';if(text(verified,key)!==expected)throw new Error('Write readback differs. Refresh; do not repeat an approval blindly.');}
 }
 async function save(id:string,updatedAt:string,action:'Generate'|'Edit'|'Approve'|'Snooze'|'Skip'|'Pause',draft:Snapshot|null,options:{subject?:string;body?:string;date?:string}={}){
  const data=await load(),p=data.profiles.find(x=>x.id===id);if(!p||p.updatedAt!==updatedAt)throw new Error('Profile changed. Refresh first.');
  let next=draft,state='Draft',review=p.review,active=p.active,snooze=p.snooze;
  if(action==='Generate'){if(p.review==='Approved'&&!await stale(p,data.templates))throw new Error('Use Edit to invalidate an approved preview before regenerating.');next=await generate(p,data.templates);review='Ready for Review';}
  else if(action==='Edit'||action==='Approve'){
   if(!draft||await stale(p,data.templates,draft))throw new Error('Needs Refresh: current Company, contact, product, project or template differs.');
   if(action==='Edit'){const t=uniqueTemplate(data.templates,draft.templateKey),f=uniqueTemplate(data.templates,t.footer,'Signature');next=editDraft(draft,options.subject||'',options.body||'',merge(f.body,{first_name:p.contact!.firstName||'there',company_name:p.companyName,product_name:p.product,last_quantity:p.quantity,last_fulfilment_date:p.last,expected_reorder_date:''}));state='Edited';if(review==='Approved')review='Ready for Review';}
   else{const d=decide(p,'Approve',draft,data.actor);next=d.draft;state=d.state;review=d.review;}
  }else{const d=decide(p,action,draft,data.actor,options.date);next=d.draft;state=d.state;review=d.review;active=d.active;snooze=d.snooze;}
  if(next&&next.body.length>2000)throw new Error('Body must be 2,000 characters or fewer.');
  const serialized=next?encodeSnapshot(next):'';
  if(action==='Approve'&&p.review==='Approved')throw new Error('This draft is already approved; no duplicate approval was written.');
  const values:Record<string,unknown>={[SNAPSHOT]:serialized,[DRAFT_BODY]:next?{text:next.body}:null,[C.draftState]:{label:state},[C.review]:{label:review},[C.active]:{label:active?'Yes':'No'},[C.snooze]:snooze?{date:snooze}:null};
  await write(id,updatedAt,values);return load();
 }
 return {load,save};
}
