import type {Snapshot} from './model.ts';
const PREFIX='zp-review-v1:';
export function encodeSnapshot(value:Snapshot){const bytes=new TextEncoder().encode(JSON.stringify(value));if(bytes.length>24000)throw new Error('Review snapshot exceeds the safe storage budget.');return PREFIX+btoa(Array.from(bytes,x=>String.fromCharCode(x)).join(''));}
export function decodeSnapshot(raw:string):Snapshot|null{
 if(!raw)return null;
 try{if(!raw.startsWith(PREFIX)||raw.length>33000)throw 0;const s=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(raw.slice(PREFIX.length)),c=>c.charCodeAt(0))));
 if(s.schema!==1||typeof s.profileId!=='string'||typeof s.fingerprint!=='string'||typeof s.subject!=='string'||typeof s.body!=='string'||typeof s.html!=='string'||!s.recipient?.id)throw 0;
 if(s.additionalRecipients!==undefined&&(!Array.isArray(s.additionalRecipients)||s.additionalRecipients.some((x:any)=>!x.recipient?.id||typeof x.recipient.email!=='string'||typeof x.subject!=='string'||typeof x.body!=='string'||typeof x.html!=='string')))throw 0;return s;
 }catch{throw new Error('Stored review snapshot is invalid. Restore/review it before continuing.');}
}
