import type {Control} from './send.ts';
import {nativePreview} from './send.ts';
export type Contact={id:string;name:string;firstName:string;email:string};
export type Project={id:string;name:string;status:string;end:string;companyIds:string[]};
export type Profile={nativeObservation?:import('./send.ts').NativeObservation;controlled?:Control;sequenceEmail?:string;sequenceFirstName?:string;sequenceCompany?:string;isQa?:boolean;id:string;name:string;updatedAt:string;companyId:string;companyName:string;kind:string;product:string;key:string;last:string;quantity:string;typical:number;confidence:string;active:boolean;review:string;snooze:string;issues:string;evidence:string;cycle:string;projectIds:string[];previousIds:string[];contact:Contact|null;contactIssue:string;projects:Project[];snapshot:Snapshot|null;draftState:string};
export type Template={id:string;name:string;key:string;process:string;subject:string;body:string;footer:string;active:boolean;version:string;component:string};
export type Snapshot={schema:1;profileId:string;cycle:string;fingerprint:string;templateKey:string;templateVersion:string;footerKey:string;footerVersion:string;recipient:Contact;companyId:string;subject:string;body:string;html:string;generatedAt:string;edited:boolean;approvedAt:string|null;approvedBy:string|null;decision:string;decisionAt?:string};
export function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Australia/Adelaide',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function addDays(s:string,n:number){const d=new Date(s+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function capDate(s:string){const [y,m,d]=s.split('-').map(Number),month=m-1+18,year=y+Math.floor(month/12),target=month%12;return new Date(Date.UTC(year,target,Math.min(d,new Date(Date.UTC(year,target+1,0)).getUTCDate()))).toISOString().slice(0,10);}
export function timing(p:Profile,now=today()){
 if(!p.last)return {expected:'',status:'Not Ready',cap:false};
 const cap=capDate(p.last),normal=p.typical>0?addDays(p.last,p.typical):cap,expected=normal<cap?normal:cap;
 const days=Math.round((Date.parse(expected)-Date.parse(now))/86400000);
 const status=p.controlled&&p.active&&p.review!=='Paused'?'Soon Due':!p.active||p.review==='Paused'?'Paused':days>60?'Not Due':days>30?'Soon Due':days>=-14?'Due':days>=-120?'Overdue':'Lapsed';
 return {expected,status,cap:p.controlled?false:!(p.typical>0)||normal>=cap};
}
export function blockReason(p:Profile,now=today()):string{
 if(p.kind!=='Verified Profile')return 'This record is not a verified reorder profile.';
 if(!p.active||p.review==='Paused')return 'Reminders are paused. Reactivate manually in Reorder Management.';
 if(!p.companyId||!p.key||!p.product)return 'Company or product identity needs review.';
 if(p.issues)return 'Resolve the source review issues before generating a preview.';
 if([...p.projectIds,...p.previousIds].some(id=>!p.projects.some(x=>x.id===id)))return 'A referenced project is unavailable. Review its source before generating a preview.';
 if(p.projects.some(x=>p.projectIds.includes(x.id)&&x.status!=='Completed'))return 'The linked project is still active. The reorder clock starts after completion.';
 if(p.projects.some(x=>x.companyIds.includes(p.companyId)&&x.status!=='Completed'))return 'This company has an active project. Confirm its relevance before a reorder review.';
 if(p.projects.some(x=>x.companyIds.includes(p.companyId)&&x.status==='Completed'&&x.end>p.last&&!p.projectIds.includes(x.id)))return 'A newer completed project needs reconciliation with this product profile.';
 if(!p.last||p.last>now)return 'An approved completed fulfilment date is required.';
 if(!p.contact||p.contactIssue)return p.contactIssue||'A current Primary Contact and email are required.';
 if(p.review==='Snoozed'&&(!p.snooze||p.snooze>now))return 'Snoozed until '+(p.snooze||'a date is selected')+'.';
 if(['Skipped','Sent'].includes(p.review))return 'This purchase cycle is already '+p.review.toLowerCase()+'.';
 if(timing(p,now).status==='Not Due')return 'This profile is not yet due for review.';
 return '';
}
export function chooseKey(p:Profile,now=today()){
 if(blockReason(p,now))return null;
 const t=timing(p,now);if(t.cap)return 'reorder.18_month';
 return t.status==='Soon Due'?'reorder.stock_check':t.status==='Due'?'reorder.due':['Overdue','Lapsed'].includes(t.status)?'reorder.overdue':null;
}
export function uniqueTemplate(templates:Template[],key:string,kind='Template'){
 const found=templates.filter(x=>x.key===key);if(found.length!==1||!found[0].active||found[0].component!==kind||found[0].process!=='Reorder'||!found[0].version)throw new Error('Template configuration missing, duplicated or inactive: '+key);return found[0];
}
export function merge(text:string,values:Record<string,string>){
 const result=text.replace(/{{\s*([a-z_]+)\s*}}/g,(_,key:string)=>{if(!(key in values))throw new Error('Unsupported merge token: '+key);return values[key];});
 if(/{{|}}/.test(result))throw new Error('Unresolved merge token.');return result;
}
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function html(text:string){
 // Authoring supports paragraphs, line breaks, **bold** and [links](https://...). Raw HTML is always escaped.
 return text.split(/\n\s*\n/).map(paragraph=>'<p>'+escape(paragraph).replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')+'</p>').join('');
}
export async function fingerprint(p:Profile,t:Template,f:Template){
 const source=JSON.stringify({company:[p.companyId,p.companyName],product:[p.key,p.product,p.quantity],history:[p.last,p.typical,p.projectIds,p.previousIds,p.cycle],controlled:p.controlled,confidence:p.confidence,active:p.active,snooze:p.snooze,issues:p.issues,contact:p.contact,contactIssue:p.contactIssue,projects:p.projects,template:t,footer:f});
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(source));return Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
}
export async function generate(p:Profile,templates:Template[],now=today()):Promise<Snapshot>{
 const key=chooseKey(p,now);if(!key)throw new Error(blockReason(p,now)||'No applicable template.');
 const t=uniqueTemplate(templates,key),f=uniqueTemplate(templates,t.footer,'Signature');
 const values={first_name:p.contact!.firstName||'there',company_name:p.companyName,product_name:p.product,last_quantity:p.quantity?Number(p.quantity).toLocaleString('en-AU'):'not recorded',last_fulfilment_date:p.last,expected_reorder_date:timing(p,now).expected};
 const native=p.controlled?nativePreview(p,templates):null;const subject=native?.subject??merge(t.subject,values),body=native?.body??merge(t.body,values),footer=merge(f.body,values);
 if(/[\r\n]/.test(subject))throw new Error('Subject must be one line.');
 return {schema:1,profileId:p.id,cycle:p.cycle||p.last,fingerprint:await fingerprint(p,t,f),templateKey:t.key,templateVersion:t.version,footerKey:f.key,footerVersion:f.version,recipient:{...p.contact!},companyId:p.companyId,subject,body,html:p.controlled?html(body):html(body)+'<hr>'+html(footer),generatedAt:new Date().toISOString(),edited:false,approvedAt:null,approvedBy:null,decision:'Draft'};
}
export async function stale(p:Profile,templates:Template[],draft=p.snapshot){
 if(!draft)return false;
 if(draft.profileId!==p.id||draft.companyId!==p.companyId||draft.recipient.id!==p.contact?.id||draft.recipient.email!==p.contact?.email)return true;
 try{const t=uniqueTemplate(templates,draft.templateKey),f=uniqueTemplate(templates,t.footer,'Signature');return Boolean(blockReason(p))||draft.fingerprint!==await fingerprint(p,t,f)||chooseKey(p)!==draft.templateKey;}catch{return true;}
}
export function editDraft(d:Snapshot,subject:string,body:string,footer:string):Snapshot{
 if(!subject.trim()||!body.trim()||/[\r\n]/.test(subject)||/{{|}}/.test(subject+body))throw new Error('Enter a one-line subject and body without unresolved tokens.');
 return {...d,subject,body,html:html(body)+'<hr>'+html(footer),edited:true,approvedAt:null,approvedBy:null,decision:'Edited'};
}
export function decide(p:Profile,action:'Approve'|'Snooze'|'Skip'|'Pause',draft:Snapshot|null,actor:string,date?:string,now=today()){
 if(action==='Approve'){
  if(!draft||blockReason(p,now))throw new Error(blockReason(p,now)||'Generate a current preview first.');
  return {review:'Approved',active:p.active,snooze:p.snooze,draft:{...draft,approvedAt:new Date().toISOString(),approvedBy:actor,decision:'Approved'},state:'Approved'};
 }
 if(action==='Snooze'&&(!date||date<=now))throw new Error('Select a future snooze date.');
 const decision=action==='Snooze'?'Snoozed':action==='Skip'?'Skipped':'Paused';
 return {review:decision,active:action==='Pause'?false:p.active,snooze:action==='Snooze'?date!:p.snooze,draft:draft?{...draft,approvedAt:null,approvedBy:null,decision,decisionAt:new Date().toISOString()}:null,state:draft?'Needs Refresh':'Empty'};
}
