import type {Draft} from './schema.ts';
import {isDecimal} from './numeric.ts';
// Explicit allowlist: never return supplier names, descriptions, costs, FX, notes or markup.
// Future portal must produce this DTO server-side after authorization, never fetch internal drafts.
export function customerQuotation(d:Draft) {
 return {reference:d.name,description:d.customerDesc,quantity:d.sellQuantity,unitPriceAUD:d.sellUnit,artwork:d.artwork};
}
export const DESCRIPTION_FIELDS: (keyof Draft)[]=['packaging','size','microns','style','colour','printing','company','shipping','quantity'];
const capitalise=(s:string)=>s?`${s[0].toUpperCase()}${s.slice(1)}`:'';
export type Destination={country:'Australia'|'United Kingdom';postcode:string};
export function destination(address:string):Destination|undefined {
 const parts=address.split(/[,\n]/).map(s=>s.trim()).filter(Boolean);
 const au=parts.some(s=>/^(?:\d{4}\s+)?(Australia|AU|AUS)(?:\s+\d{4})?$/i.test(s));
 const uk=parts.some(s=>/^(?:[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\s+)?(United Kingdom|UK|Great Britain|GB)$/i.test(s));
 // A destination must be explicitly recorded, never inferred from city/postcode alone.
 if(au===uk)return undefined;
 const postcode=au?address.match(/\b\d{4}\b(?=[^\d]*$)/)?.[0]??'':address.match(/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i)?.[0].toUpperCase()??'';
 return {country:au?'Australia':'United Kingdom',postcode};
}
export function specificationDescription(d:Draft,shippingAddress='') {
 if(!d.packaging.trim())return '';
 const cert=certification(d,shippingAddress),dest=destination(shippingAddress);
 const product=['Custom-designed',d.colour,cert?'certified compostable':'',d.packaging].filter(Boolean).join(' ');
 const size=[d.size,d.style].filter(Boolean).join(' and ');
 const lines=[product,size,d.microns?`${d.microns} mic thick`:'',capitalise(d.printing),cert].filter(Boolean);
 if(Number(d.shipping)>0&&dest){
  lines.push('','DDP Delivery Included: Final delivery cost will be confirmed based on the delivery address and final shipment weight and dimensions.','','Includes:',`Deliver to: ${dest.country}${dest.postcode?`, ${dest.postcode}`:''}`,'Freight, insurance and all applicable import and customs duties, fees and taxes.');
 }
 return lines.join('\n');
}
// Relevant specifications always regenerate both descriptions as one undoable edit.
export function updateDescriptions(before:Draft,after:Draft,company:import('./adapter.ts').Ref|undefined):Draft {
 if(!DESCRIPTION_FIELDS.some(k=>before[k]!==after[k]))return after;
 return generatedDescriptions(after,company);
}
export function generatedDescriptions(d:Draft,company:import('./adapter.ts').Ref|undefined):Draft {
 return {...d,customerDesc:specificationDescription(d,company?.shippingAddress),supplierDesc:supplierDescription(d,company?.name,company?.shippingAddress)};
}
export function shippingQuote(d:Draft,company:import('./adapter.ts').Ref|undefined):string {
 if(!company?.shippingAddress?.trim()||!d.weight||!d.cbm||!d.quantity||!d.packaging)throw new Error('Select a company with a shipping address and enter weight, CBM, supplier quantity and packaging type.');
 if([d.weight,d.cbm,d.quantity].some(v=>!isDecimal(v))||!Number.isSafeInteger(Number(d.quantity)))throw new Error('Shipping weight, CBM and quantity must be valid non-negative numbers; quantity must be a whole number.');
 const n=(s:string)=>Number(s).toLocaleString('en-AU',{maximumFractionDigits:8});
 return `Can you quote for sending...\n${n(d.weight)}kgs, ${n(d.cbm)}cbm - ${n(d.quantity)} x ${d.packaging}\n${company.name}\n${company.shippingAddress}`;
}

export function companyContact(companyId:string,companies:import('./adapter.ts').Ref[],contacts:import('./adapter.ts').Ref[]):string {
 const company=companies.find(c=>c.id===companyId),linked=contacts.filter(c=>c.companyIds?.includes(companyId));
 const primary=linked.filter(c=>company?.primaryContactIds?.includes(c.id));
 return primary.length===1?primary[0].id:primary.length===0&&linked.length===1?linked[0].id:'';
}
export function supplierDescription(d:Draft,companyName='',shippingAddress='') {
 if(!d.packaging.trim())return '';
 const cert=certification(d,shippingAddress);
 const product=['Customised',cert,d.colour,d.packaging].filter(Boolean).join(' ');
 const dimensions=[d.size,d.style].filter(Boolean).join(' and ');
 const detail=[dimensions,d.microns?`${d.microns} mic thick`:''].filter(Boolean).join(' ');
 const specification=`${d.quantity?`${Number(d.quantity).toLocaleString('en-AU')} - `:''}${product}${d.printing?`: ${d.printing}`:''}${detail?` - ${detail}`:''}`;
 return ['Can you please quote for:',companyName?`Company: ${companyName}`:'',specification,'','Please include weights and cbm for shipping.'].filter((v,i)=>v||i===3).join('\n');
}

// Sources: current Product & Packaging Knowledge Core and Claims & Evidence Policy,
// 13 September 2026 approvals; country/thickness mapping confirmed by Patrick 10 October 2026.
export function certification(d:Draft,address:string):string {
 if(!['mail satchel','compostable mailer','custom compostable mailer','custom compostable mailers'].includes(d.packaging.trim().toLowerCase()))return '';
 const thickness=Number(d.microns);
 if(!d.microns.trim()||!Number.isFinite(thickness)||thickness<=0||thickness>143)return '';
 const home=thickness<=63;
 if(destination(address)?.country==='Australia')return home?'Certified to AS 5810 - Home Compostable':'Certified to AS 4736 - Commercially Compostable';
 if(destination(address)?.country==='United Kingdom')return home?'Certified OK compost HOME':'OK compost INDUSTRIAL';
 return '';
}
