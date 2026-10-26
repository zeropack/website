import {BOARD,TEMPLATES,COMPANIES,CONTACTS,PROJECTS,C,T,SNAPSHOT,DRAFT_BODY,WRITABLE} from './schema.ts';
import {blockReason,decide,editDraft,generate,merge,stale,today,uniqueTemplate,recipientPreviews} from './model.ts';
import type {Profile,Template,Project,Snapshot,Contact} from './model.ts';
import {encodeSnapshot,decodeSnapshot} from './codec.ts';
import {QA_ID,qaProfile} from './qa.ts';
import {controlled,STOCK_SEQUENCE} from './send.ts';
import type {Control,Receipt} from './send.ts';
type CV={id:string;text?:string|null;value?:string|null;linked_item_ids?:string[];display_value?:string};
type Item={id:string;name:string;updated_at:string;board?:{id:string};column_values:CV[]};
type Result={data?:any;errors?:{message:string}[];error_message?:string};
export type Transport=(query:string,variables?:Record<string,unknown>)=>Promise<Result>;
const text=(i:Item,id:string)=>i.column_values.find(x=>x.id===id)?.display_value||i.column_values.find(x=>x.id===id)?.text||'';
const links=(i:Item,id:string)=>i.column_values.find(x=>x.id===id)?.linked_item_ids||[];
const nativeObservation=(r:Item)=>{try{return JSON.parse(text(r,'long_text_mm8f220m')).nativeRun;}catch{return undefined;}};
const ids=(list:string[])=>{if(list.some(x=>!/^\d+$/.test(x)))throw new Error('Invalid canonical ID.');return [...new Set(list)];};
export function createAdapter(transport:Transport){
 async function api(q:string,v?:Record<string,unknown>){const r=await transport(q,v);if(r.errors?.length||r.error_message||!r.data)throw new Error(r.errors?.map(x=>x.message).join('; ')||r.error_message||'Monday returned no data.');return r.data;}
 async function board(id:string,required:Record<string,string>){
  const d=await api('query($id:[ID!]){boards(ids:$id){id columns{id title type} items_page(limit:500){cursor items{id name updated_at column_values{id text ... on BoardRelationValue{linked_item_ids} ... on MirrorValue{display_value}}}}}}',{id:[id]});
  const b=d.boards?.[0];if(!b||b.id!==id)throw new Error('Required private board is unavailable: '+id);
  for(const [col,type]of Object.entries(required)){if(!b.columns.some((c:any)=>c.id===col&&c.type===type))throw new Error('Board schema changed: '+col);}
  const items:Item[]=[...b.items_page.items];let cursor=b.items_page.cursor;const seen=new Set<string>();
  for(let n=0;cursor;n++){if(n>=20||seen.has(cursor))throw new Error('Incomplete paging; no data has been written.');seen.add(cursor);const next=await api('query($cursor:String!){next_items_page(cursor:$cursor,limit:500){cursor items{id name updated_at column_values{id text ... on BoardRelationValue{linked_item_ids} ... on MirrorValue{display_value}}}}}',{cursor});items.push(...next.next_items_page.items);cursor=next.next_items_page.cursor;}
  return items;
 }
 async function itemBatch(list:string[],expectedBoard:string){
  if(!list.length)return [] as Item[];const result:Item[]=[];
  for(let i=0;i<list.length;i+=100){const d=await api('query($ids:[ID!]){items(ids:$ids){id name updated_at board{id} column_values{id text ... on BoardRelationValue{linked_item_ids} ... on MirrorValue{display_value}}}}',{ids:ids(list.slice(i,i+100))});
   if(d.items.length!==new Set(list.slice(i,i+100)).size||d.items.some((x:Item)=>x.board?.id!==expectedBoard))throw new Error('A canonical linked record is inaccessible or points to the wrong board.');result.push(...d.items);}
  return result;
 }
 async function load(qaMode=false,control?:Control){
  const [rows,tr,pr,me]=await Promise.all([board(BOARD,{[SNAPSHOT]:'text',[DRAFT_BODY]:'long_text',[C.draftState]:'status',[C.active]:'status',[C.review]:'status',[C.company]:'board_relation',[C.emailProduct]:'text'}),board(TEMPLATES,{[T.key]:'text',[T.body]:'long_text',[T.component]:'status'}),board(PROJECTS,{project_status:'status',project_timeline:'timeline'}),api('query{me{id name email}}')]);
  const companyIds=ids(rows.flatMap(r=>links(r,C.company))),companies=await itemBatch(companyIds,COMPANIES);
  const contactIds=ids(companies.flatMap(r=>links(r,'board_relation_mm4nz01g'))),contacts=await itemBatch(contactIds,CONTACTS);
  const projects:Project[]=pr.map(r=>({id:r.id,name:r.name,status:text(r,'project_status'),end:text(r,'project_timeline').match(/\d{4}-\d{2}-\d{2}/g)?.at(-1)||'',companyIds:links(r,'board_relation_mm6471v8')})).sort((a,b)=>a.id.localeCompare(b.id));
  const templates:Template[]=tr.map(r=>({id:r.id,name:r.name,key:text(r,T.key),subject:text(r,T.subject),body:text(r,T.body),footer:text(r,T.footer),active:text(r,T.active)==='Yes',version:text(r,T.version),process:text(r,T.process),component:text(r,T.component)}));
  const profiles:Profile[]=rows.filter(r=>qaMode?r.id===QA_ID&&text(r,C.kind)==='QA':text(r,C.kind)!=='QA').map(r=>{
   const companyList=links(r,C.company),companyId=companyList.length===1?companyList[0]:'',company=companies.find(x=>x.id===companyId),primary=company?[...new Set(links(company,'board_relation_mm4nz01g'))].sort():[];
   const resolvedContacts:Contact[]=[];const contactProblems:string[]=[];
   for(const id of primary){const contact=contacts.find(x=>x.id===id);if(!contact){contactProblems.push('Current Primary Contact is unavailable.');continue;}
    const email=text(contact,'contact_email').trim(),contactCompanies=links(contact,'contact_account');
    const issue=!email||!/^\S+@\S+\.\S+$/.test(email)?'Current Primary Contact has no valid email.':contactCompanies.length&&!contactCompanies.includes(companyId)?'Primary Contact Company relation conflicts with this Company.':'';
    if(issue)contactProblems.push(issue);
    if(!issue||(control&&primary.length===1&&issue.startsWith('Primary Contact Company relation conflicts')))resolvedContacts.push({id:contact.id,name:[text(contact,'text_mm5n6d0w'),text(contact,'text_mm4pxvbs')].filter(Boolean).join(' ')||contact.name,firstName:text(contact,'text_mm5n6d0w'),email});
   }
   const contactIssue=!primary.length?'No current Primary Contact is selected.':contactProblems.join(' '),resolved=resolvedContacts[0]||null;
   const projectIds=links(r,C.lastProject),previousIds=links(r,C.previousProject);
   return {nativeObservation:nativeObservation(r),sequenceEmail:text(r,'lookup_mm8fgngv'),sequenceFirstName:text(r,'text_mm8fvfzr'),sequenceCompany:text(r,'text_mm8fk7dv'),id:r.id,name:r.name,updatedAt:r.updated_at,companyId,companyName:company?.name||r.name,kind:text(r,C.kind),product:text(r,C.product),emailProduct:text(r,C.emailProduct),key:text(r,C.key),last:text(r,C.last),quantity:text(r,C.quantity),typical:Number(text(r,C.typical))||0,confidence:text(r,C.confidence),active:text(r,C.active)==='Yes',review:text(r,C.review),snooze:text(r,C.snooze),issues:text(r,C.issues),evidence:text(r,C.evidence),cycle:text(r,C.cycle),projectIds,previousIds,contact:resolved,contacts:resolvedContacts,contactIssue,projects:projects.filter(x=>x.companyIds.includes(companyId)||projectIds.includes(x.id)||previousIds.includes(x.id)),snapshot:decodeSnapshot(text(r,SNAPSHOT)),draftState:text(r,C.draftState)};
  });
  if(!me.me?.id)throw new Error('Current staff identity unavailable.');
  return {profiles:qaMode?profiles.map(p=>qaProfile(p,me.me)):control?profiles.filter(p=>p.id===control.profileId).map(p=>controlled(p,control)):profiles,templates,actor:String(me.me.id)};
 }
 async function write(id:string,expectedUpdatedAt:string,values:Record<string,unknown>,extra:string[]=[]){
  if(Object.keys(values).some(x=>!WRITABLE.has(x)&&!extra.includes(x)))throw new Error('Write outside Phase 2 allowlist.');
  const latest=await itemBatch([id],BOARD);if(latest[0].updated_at!==expectedUpdatedAt)throw new Error('This profile changed in Monday. Refresh before saving.');
  await api('mutation($board:ID!,$item:ID!,$values:JSON!){change_multiple_column_values(board_id:$board,item_id:$item,column_values:$values){id}}',{board:BOARD,item:id,values:JSON.stringify(values)});
  const verified=(await itemBatch([id],BOARD))[0];
  for(const [key,value]of Object.entries(values)){const expected=typeof value==='string'?value:(value as any)?.text??(value as any)?.label??(value as any)?.date??'';if(text(verified,key)!==expected)throw new Error('Write readback differs. Refresh; do not repeat an approval blindly.');}
 }
 async function save(id:string,updatedAt:string,action:'Generate'|'Edit'|'Approve'|'Snooze'|'Skip'|'Pause',draft:Snapshot|null,options:{subject?:string;body?:string;date?:string;recipientId?:string;qaMode?:boolean;control?:Control}={}){
  const data=await load(options.qaMode,options.control),p=data.profiles.find(x=>x.id===id);if(!p||p.updatedAt!==updatedAt)throw new Error('Profile changed. Refresh first.');
  let next=draft,state='Draft',review=p.review,active=p.active,snooze=p.snooze;
  if(action==='Generate'){if(p.review==='Approved'&&!await stale(p,data.templates))throw new Error('Use Edit to invalidate an approved preview before regenerating.');next=await generate(p,data.templates);review='Ready for Review';}
  else if(action==='Edit'||action==='Approve'){
   if(action==='Edit'&&p.controlled)throw new Error('This native Sequence test uses its verified operational body; instance edits cannot be sent.');
   if(!draft||await stale(p,data.templates,draft))throw new Error('Needs Refresh: current Company, contact, product, project or template differs.');
   if(action==='Edit'){const selected=recipientPreviews(draft).find(x=>x.recipient.id===(options.recipientId||draft.recipient.id));if(!selected)throw new Error('Preview recipient changed.');const t=uniqueTemplate(data.templates,draft.templateKey),f=uniqueTemplate(data.templates,t.footer,'Signature');next=editDraft(draft,options.subject||'',options.body||'',merge(f.body,{first_name:selected.recipient.firstName||'there',company_name:p.companyName,product_name:p.emailProduct.trim(),last_quantity:p.quantity,last_fulfilment_date:p.last,expected_reorder_date:''}),selected.recipient.id);state='Edited';if(review==='Approved')review='Ready for Review';}
   else{const d=decide(p,'Approve',draft,data.actor);next=d.draft;state=d.state;review=d.review;}
  }else{const d=decide(p,action,draft,data.actor,options.date);next=d.draft;state=d.state;review=d.review;active=d.active;snooze=d.snooze;}
  if(next&&recipientPreviews(next).some(x=>x.body.length>2000))throw new Error('Body must be 2,000 characters or fewer.');
  const serialized=next?encodeSnapshot(next):'';
  if(action==='Approve'&&p.review==='Approved')throw new Error('This draft is already approved; no duplicate approval was written.');
  const values:Record<string,unknown>={[SNAPSHOT]:serialized,[DRAFT_BODY]:next?{text:next.body}:null,[C.draftState]:{label:state},[C.review]:{label:review},[C.active]:{label:active?'Yes':'No'},[C.snooze]:snooze?{date:snooze}:null};
  await write(id,updatedAt,values);return load(options.qaMode,options.control);
 }
 async function prepareQa(enabled:boolean){
  const data=await load(true),p=data.profiles.find(x=>x.id===QA_ID);
  if(!p)throw new Error('Excluded QA fixture is unavailable.');
  await write(QA_ID,p.updatedAt,{[SNAPSHOT]:'',[DRAFT_BODY]:null,[C.draftState]:{label:'Empty'},[C.review]:{label:enabled?'Ready for Review':'Not Ready'},[C.active]:{label:enabled?'Yes':'No'},[C.snooze]:null});
  return load(true);
 }
 async function sequences(){const d=await api('query($board:ID!){allowed_sequences_to_enroll(board_id:$board){id title status context_id step_count updated_at}}',{board:BOARD});return d.allowed_sequences_to_enroll||[];}
 async function prepareControlled(c:Control){
  const data=await load(false,c),p=data.profiles[0];if(!p)throw new Error('Controlled profile unavailable.');
  const values={[C.active]:{label:'Yes'},[C.review]:{label:'Ready for Review'},[C.snooze]:null,['text_mm8fk7dv']:p.companyName,['text_mm8fvfzr']:p.contact!.firstName||'there',['email_mm8f9zj4']:{email:p.contact!.email,text:p.contact!.email}};
  await write(p.id,p.updatedAt,values,['text_mm8fk7dv','text_mm8fvfzr','email_mm8f9zj4']);return load(false,c);
 }
 async function enrollControlled(c:Control){const d=await api('mutation($input:EnrollToSequenceInput!){enroll_items_to_sequence(input:$input){succeeded_item_ids failed_item_ids}}',{input:{sequence_id:c.sequenceId,board_id:BOARD,item_ids:[c.profileId]}});return d.enroll_items_to_sequence;}
 async function logEnrollment(c:Control,r:Receipt){const p=(await itemBatch([c.profileId],BOARD))[0];await write(c.profileId,p.updated_at,{['long_text_mm8f220m']:{text:JSON.stringify({...r,sequenceId:c.sequenceId,sequenceName:'Reorder - Stock Check'})}},['long_text_mm8f220m']);}
 async function bootstrapControl(expectedEmail:string):Promise<Control>{
  const d=await load();if(d.actor!=='106642719')throw new Error('Only the authorized test reviewer may provision this controlled cycle.');
  const company=(await itemBatch(['2757796581'],COMPANIES))[0],primary=links(company,'board_relation_mm4nz01g');if(primary.length!==1||primary[0]!=='2827341666')throw new Error('The current controlled Primary Contact differs.');
  const contact=(await itemBatch(primary,CONTACTS))[0],email=text(contact,'contact_email');if(email.toLowerCase()!==expectedEmail.trim().toLowerCase())throw new Error('Current canonical test email differs.');
  const seq=(await sequences()).find((x:any)=>x.id===STOCK_SEQUENCE);if(seq?.status!=='ACTIVE'||seq.step_count!==1||seq.context_id!==BOARD)throw new Error('Activate the verified zero-enrollment Stock Check sequence first.');
  const t=uniqueTemplate(d.templates,'reorder.stock_check');
  return {profileId:'2889840971',companyId:'2757796581',contactId:contact.id,email,sequenceId:seq.id,revision:seq.updated_at,cycle:'controlled-codeblack-20261026',templateBody:t.body,templateSubject:t.subject,nativeSignoff:'Regards,\nPatrick\nZero Pack Team',expires:new Date(Date.now()+2*3600000).toISOString()};
 }
 return {load,save,prepareQa,sequences,prepareControlled,enrollControlled,logEnrollment,bootstrapControl};
}
