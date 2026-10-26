import {addDays,today} from './model.ts';
import type {Profile} from './model.ts';
export const QA_ID='2889840324';
export function qaProfile(p:Profile,actor:{id:string;name:string;email?:string}):Profile {
 if(p.id!==QA_ID||p.kind!=='QA'||p.companyId||p.projectIds.length||p.previousIds.length)throw new Error('QA requires the excluded, unlinked fixture.');
 if(!actor.id||!actor.email||!/^[-.\w+]+@zeropack\.co$/i.test(actor.email))throw new Error('Internal QA requires a Zero Pack staff email.');
 return {...p,contacts:undefined,isQa:true,kind:'Verified Profile',companyId:'internal-qa',companyName:'Zero Pack — INTERNAL QA',product:'Synthetic packaging test — no customer order',emailProduct:'synthetic packaging',key:'internal-qa-only',last:addDays(today(),-180),typical:220,quantity:'100',cycle:'installed-mutation-qa',issues:'',projects:[],contactIssue:'',contact:{id:'staff-'+actor.id,name:actor.name,firstName:'QA',email:actor.email}};
}
