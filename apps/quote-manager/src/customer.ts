import type {Draft} from './schema.ts';
// Explicit allowlist: never return supplier names, descriptions, costs, FX, notes or markup.
// Future portal must produce this DTO server-side after authorization, never fetch internal drafts.
export function customerQuotation(d:Draft) {
 return {reference:d.name,description:d.customerDesc,quantity:d.sellQuantity,unitPriceAUD:d.sellUnit,artwork:d.artwork};
}
export function specificationDescription(d:Draft) {
 return [d.packaging,d.size,d.microns?`${d.microns} microns`:'',d.style,d.colour,d.printing,d.sellQuantity?`Qty ${Number(d.sellQuantity).toLocaleString('en-AU')}`:''].filter(Boolean).join(' · ');
}

export function companyContact(companyId:string,companies:import('./adapter.ts').Ref[],contacts:import('./adapter.ts').Ref[]):string {
 const company=companies.find(c=>c.id===companyId),linked=contacts.filter(c=>c.companyIds?.includes(companyId));
 const primary=linked.filter(c=>company?.primaryContactIds?.includes(c.id));
 return primary.length===1?primary[0].id:primary.length===0&&linked.length===1?linked[0].id:'';
}
export function supplierDescription(d:Draft,companyName='',shippingAddress='') {
 const specification=specificationDescription(d);
 return ["Can you please quote for:",companyName?`Company: ${companyName}`:'',specification,shippingAddress?`Ship to: ${shippingAddress}`:'','Please include weights and CBM for shipping.'].filter((v,i)=>v||i===3).join('\n');
}
