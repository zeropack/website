import {BOARD} from './schema.ts';
import {blockReason,stale,html,merge} from './model.ts';
import type {Profile,Template} from './model.ts';
export const LEDGER='zp-reorder-send-ledger-v1',CONTROLLED_PROFILE='2889840971',CONTROLLED_COMPANY='2757796581',STOCK_SEQUENCE='ce965250-e06e-4427-9f48-f9d2258bc58b';
export type Control={profileId:string;companyId:string;contactId:string;email:string;sequenceId:string;revision:string;cycle:string;templateBody:string;templateSubject:string;nativeSignoff:string;expires:string};
export type Receipt={key:string;state:'Sending / Enrollment Pending'|'Enrolled'|'Blocked by monday'|'Sent'|'Send status requires review';fingerprint:string;at:string;recipient:string;detail?:string};
export type Ledger={schema:1;lockVerified:boolean;control:Control;attempts:Record<string,Receipt>};
export type Storage={getItem:(key:string)=>Promise<any>;setItem:(key:string,value:string,options?:{previous_version?:string})=>Promise<any>};
export function receiptKey(p:Profile,c:Control){return [p.id,p.cycle||p.last,c.sequenceId].join(':');}
export function controlled(p:Profile,c:Control):Profile {
 if(p.id!==CONTROLLED_PROFILE||p.id!==c.profileId||p.companyId!==CONTROLLED_COMPANY||p.companyId!==c.companyId||p.contact?.id!==c.contactId||p.contact?.email.toLowerCase()!==c.email.toLowerCase()||Date.now()>Date.parse(c.expires))throw new Error('Controlled test identity or time window changed.');
 if(p.contactIssue&&!p.contactIssue.startsWith('Primary Contact Company relation conflicts'))throw new Error(p.contactIssue);
 return {...p,controlled:c,contactIssue:'',cycle:c.cycle};
}
export function classifyRun(status:string,reason:string|null,stepSent=false):Receipt['state']{
 if(/unsubscrib|not_permitted|permission|suppres|crm_subscription_not_found/i.test(reason||''))return 'Blocked by monday';
 if(stepSent&&['completed','active','waiting'].includes(status))return 'Sent';
 if(status==='terminated')return 'Send status requires review';
 return 'Enrolled';
}
export async function ledgerRead(s:Storage){const r=await s.getItem(LEDGER);if(!r.data?.success||!r.data.version||!r.data.value)throw new Error('Send ledger is not provisioned.');const value=typeof r.data.value==='string'?JSON.parse(r.data.value):r.data.value;if(value.schema!==1)throw new Error('Invalid send ledger.');return {value:value as Ledger,version:String(r.data.version)};}
async function cas(s:Storage,value:Ledger,version:string){const r=await s.setItem(LEDGER,JSON.stringify(value),{previous_version:version});if(!r.data?.success||!r.data.version)throw new Error('Send lock conflict or storage failure. No enrollment was started.');return String(r.data.version);}
export async function claim(s:Storage,p:Profile){const r=await ledgerRead(s),c=r.value.control;if(!r.value.lockVerified)throw new Error('Send lock has not passed installed QA.');const key=receiptKey(p,c);if(r.value.attempts[key])throw new Error('This reminder cycle already has a send attempt. No retry is allowed.');const receipt:Receipt={key,state:'Sending / Enrollment Pending',fingerprint:p.snapshot!.fingerprint,at:new Date().toISOString(),recipient:p.contact!.email};r.value.attempts[key]=receipt;const version=await cas(s,r.value,r.version);return {ledger:r.value,version,receipt};}
export async function sendOnce(s:Storage,id:string,expected:string,load:()=>Promise<{profiles:Profile[];templates:Template[]}>,sequence:()=>Promise<any>,enroll:()=>Promise<any>,log:(r:Receipt)=>Promise<void>){
 let d=await load(),p=d.profiles.find(p=>p.id===id);if(!p||p.updatedAt!==expected)throw new Error('Profile changed. Refresh before Send.');
 if(!p.controlled||!p.snapshot?.approvedAt||p.review!=='Approved'||p.snapshot.edited||blockReason(p)||await stale(p,d.templates))throw new Error('A current unedited approved native Sequence preview is required.');
 if(p.sequenceEmail?.toLowerCase()!==p.contact?.email.toLowerCase()||p.sequenceFirstName!==(p.contact?.firstName||'there')||p.sequenceCompany!==p.companyName)throw new Error('Sequence variables differ from current canonical CRM data.');
 const seq=await sequence();if(seq?.id!==p.controlled.sequenceId||seq.status!=='ACTIVE'||seq.context_id!==BOARD||seq.step_count!==1||seq.updated_at!==p.controlled.revision)throw new Error('Sequence state/configuration changed. Revalidate native unsubscribe controls and content.');
 const lock=await claim(s,p); // Durable claim precedes the only enrollment call.
 try{
  d=await load();const current=d.profiles.find(x=>x.id===id);if(!current||current.updatedAt!==p.updatedAt||blockReason(current)||await stale(current,d.templates)||current.sequenceEmail?.toLowerCase()!==current.contact?.email.toLowerCase()||current.sequenceFirstName!==(current.contact?.firstName||'there')||current.sequenceCompany!==current.companyName)throw new Error('Final live CRM validation changed after locking.');
  const again=await sequence();if(JSON.stringify(again)!==JSON.stringify(seq))throw new Error('Sequence changed after locking.');
  const result=await enroll();const ok=result?.succeeded_item_ids?.map(String)||[],bad=result?.failed_item_ids?.map(String)||[];
  lock.receipt.state=ok.length===1&&ok[0]===id&&bad.length===0?'Enrolled':'Send status requires review';
  lock.receipt.detail=lock.receipt.state==='Enrolled'?'Successfully enrolled in Reorder - Stock Check; native unsubscribe eligibility is enforced by monday Sequence at enrollment/run time. Sent/delivery not yet confirmed.':'Enrollment was not confirmed. Investigate native run; do not retry.';
 }catch(e){lock.receipt.state='Send status requires review';lock.receipt.detail=(e as Error).message;}
 lock.ledger.attempts[lock.receipt.key]=lock.receipt;
 try{await cas(s,lock.ledger,lock.version);}catch{throw new Error('Send status requires review. Durable initial lock remains; do not retry.');}
 await log(lock.receipt);return lock.receipt;
}
export function nativePreview(p:Profile,templates:Template[]){const c=p.controlled!;const t=templates.find(x=>x.key==='reorder.stock_check');if(!t||t.body!==c.templateBody||t.subject!==c.templateSubject)throw new Error('Backup template changed since native content verification.');const values={first_name:p.contact!.firstName||'there',company_name:p.companyName,product_name:p.product,last_quantity:p.quantity,last_fulfilment_date:p.last,expected_reorder_date:''};return {subject:merge(c.templateSubject,values),body:merge(c.templateBody,values)+'\n\n'+c.nativeSignoff};}

// Provisioning exists only in a bootstrap build which cannot enroll. The final
// sending build has no initialization/reset path, so an old initializer cannot
// overwrite a live lock. Global storage survives views and app major versions.
export async function provision(s:Storage,c:Control){
 const old=await s.getItem(LEDGER);if(old.data?.value)throw new Error('Send ledger already exists; initialization is disabled.');
 const probe='zp-reorder-cas-proof-v1';await s.setItem(probe,JSON.stringify({step:0}));const first=await s.getItem(probe);if(!first.data?.version)throw new Error('Storage versioning unavailable.');
 const results=await Promise.all([s.setItem(probe,'one',{previous_version:first.data.version}),s.setItem(probe,'two',{previous_version:first.data.version})]);
 if(results.filter(r=>r.data?.success).length!==1)throw new Error('Concurrent CAS exclusion failed. Send remains unavailable.');
 const stale=await s.setItem(probe,'stale',{previous_version:first.data.version});if(stale.data?.success)throw new Error('Stale version was accepted. Send remains unavailable.');
 const r=await s.setItem(LEDGER,JSON.stringify({schema:1,lockVerified:true,control:c,attempts:{}}));if(!r.data?.success)throw new Error('Provisioning failed.');return ledgerRead(s);
}

// Native journey APIs are inspected by the authorised operator through monday.
// This recording path cannot enroll, unlock or retry an attempt.
export type NativeObservation={source:'monday-native-inspection';profileId:string;sequenceId:string;cycle:string;runId:string;status:string;terminationReason:string|null;emailSent:boolean;evidence:string;checkedAt:string};
export async function recordNativeObservation(s:Storage,o:NativeObservation){
 const r=await ledgerRead(s),c=r.value.control,key=[o.profileId,o.cycle,o.sequenceId].join(':'),old=r.value.attempts[key];
 if(!old||o.source!=='monday-native-inspection'||o.profileId!==c.profileId||o.sequenceId!==c.sequenceId||o.cycle!==c.cycle||!o.runId||!o.evidence||!o.checkedAt)throw new Error('Native observation does not match the locked attempt.');
 const state=classifyRun(o.status,o.terminationReason,o.emailSent);
 if(old.state==='Blocked by monday'||old.state==='Sent')return old;
 const receipt={...old,state,detail:'Native run '+o.runId+': '+o.evidence};
 if(JSON.stringify(receipt)===JSON.stringify(old))return old;
 r.value.attempts[key]=receipt;await cas(s,r.value,r.version);return receipt;
}
