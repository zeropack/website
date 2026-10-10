import type {Draft} from './schema.ts';
// Explicit allowlist: never return supplier names, descriptions, costs, FX, notes or markup.
// Future portal must produce this DTO server-side after authorization, never fetch internal drafts.
export function customerQuotation(d:Draft) {
 return {reference:d.name,description:d.customerDesc,quantity:d.sellQuantity,unitPriceAUD:d.sellUnit,artwork:d.artwork};
}
export function specificationDescription(d:Draft,shippingAddress='') {
 return [d.packaging,d.size,d.microns?`${d.microns} microns`:'',d.style,d.colour,d.printing,d.sellQuantity?`Qty ${Number(d.sellQuantity).toLocaleString('en-AU')}`:'',certification(d,shippingAddress)].filter(Boolean).join(' · ');
}

export function companyContact(companyId:string,companies:import('./adapter.ts').Ref[],contacts:import('./adapter.ts').Ref[]):string {
 const company=companies.find(c=>c.id===companyId),linked=contacts.filter(c=>c.companyIds?.includes(companyId));
 const primary=linked.filter(c=>company?.primaryContactIds?.includes(c.id));
 return primary.length===1?primary[0].id:primary.length===0&&linked.length===1?linked[0].id:'';
}
export function supplierDescription(d:Draft,companyName='',shippingAddress='') {
 const specification=specificationDescription(d,shippingAddress);
 return ["Can you please quote for:",companyName?`Company: ${companyName}`:'',specification,shippingAddress?`Ship to: ${shippingAddress}`:'','Please include weights and CBM for shipping.'].filter((v,i)=>v||i===3).join('\n');
}

// Sources: current Product & Packaging Knowledge Core and Claims & Evidence Policy,
// 13 September 2026 approvals; country/thickness mapping confirmed by Patrick 10 October 2026.
export function certification(d:Draft,address:string):string {
 if(!['mail satchel','compostable mailer','custom compostable mailer','custom compostable mailers'].includes(d.packaging.trim().toLowerCase()))return '';
 const thickness=Number(d.microns);
 if(!d.microns.trim()||!Number.isFinite(thickness)||thickness<=0||thickness>143)return '';
 const home=thickness<=63;
 if(/(?:^|[,\s])(?:Australia|AU|AUS)\s*$/i.test(address))return home?'AS 5810 certified — Home compostable':'AS 4736 certified — Commercially compostable';
 if(/(?:^|[,\s])(?:United Kingdom|UK|Great Britain|GB)\s*$/i.test(address))return home?'OK compost HOME certified — Home compostable':'OK compost INDUSTRIAL certified — Commercially compostable';
 return '';
}
