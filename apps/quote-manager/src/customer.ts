import type {Draft} from './schema.ts';
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
 const au=parts.some(s=>/^(Australia|AU|AUS)(?:\s+\d{4})?$/i.test(s));
 const uk=parts.some(s=>/^(United Kingdom|UK|Great Britain|GB)$/i.test(s));
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
// Specification changes and their generated descriptions form one undoable edit.
// Free-text edits pause the corresponding generator until Update is selected.
export function updateDescriptions(before:Draft,after:Draft,company:import('./adapter.ts').Ref|undefined,auto:{customer:boolean;supplier:boolean}):Draft {
 if(!DESCRIPTION_FIELDS.some(k=>before[k]!==after[k]))return after;
 return {...after,...(auto.customer?{customerDesc:specificationDescription(after,company?.shippingAddress)}:{}),...(auto.supplier?{supplierDesc:supplierDescription(after,company?.name,company?.shippingAddress)}:{})};
}

export function companyContact(companyId:string,companies:import('./adapter.ts').Ref[],contacts:import('./adapter.ts').Ref[]):string {
 const company=companies.find(c=>c.id===companyId),linked=contacts.filter(c=>c.companyIds?.includes(companyId));
 const primary=linked.filter(c=>company?.primaryContactIds?.includes(c.id));
 return primary.length===1?primary[0].id:primary.length===0&&linked.length===1?linked[0].id:'';
}
export function supplierDescription(d:Draft,companyName='',shippingAddress='') {
 if(!d.packaging.trim())return '';
 const specification=[d.packaging,d.size,d.style,d.microns?`${d.microns} mic thick`:'',d.colour,capitalise(d.printing),d.quantity?`Qty ${Number(d.quantity).toLocaleString('en-AU')}`:'',certification(d,shippingAddress)].filter(Boolean).join('\n');
 return ['Can you please quote for:',companyName?`Company: ${companyName}`:'',specification,'',shippingAddress?`Ship to: ${shippingAddress}`:'','Please include weights and CBM for shipping.'].filter((v,i)=>v||i===3).join('\n');
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
