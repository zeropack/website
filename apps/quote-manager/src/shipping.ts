import type {Draft} from './schema.ts';
import {isDecimal} from './numeric.ts';
export const SHIPPING_METHODS=['DDP','FOB','EXW','Domestic'] as const;
export const defaultDuties=(method:string)=>method==='DDP'?'Yes':'No';
// Empty fields identify legacy quotations: keep their previous freight/no-freight behaviour.
export function shippingOptions(d:Draft) {
 const method=d.shippingMethod||'DDP';
 return {included:d.shippingIncluded||(Number(d.shipping)>0?'Yes':'No'),method,duties:d.dutiesIncluded||defaultDuties(method)};
}
export function withShippingDefaults(d:Draft):Draft {
 const options=shippingOptions(d);
 return {...d,shippingIncluded:options.included,shippingMethod:options.method,dutiesIncluded:options.duties};
}
const formatted=(s:string)=>Number(s).toLocaleString('en-AU',{maximumFractionDigits:8});
const positive=(s:string)=>!!s&&isDecimal(s)&&Number(s)>0;
export function cartonDescription(d:Draft):string {
 const parts:string[]=[];
 if(positive(d.cartonCount))parts.push(`${formatted(d.cartonCount)} ${Number(d.cartonCount)===1?'carton':'cartons'}`);
 if([d.cartonHeight,d.cartonWidth,d.cartonLength].every(positive))parts.push(`${[d.cartonHeight,d.cartonWidth,d.cartonLength].map(formatted).join(' × ')} cm (H × W × L) per carton`);
 if(positive(d.cartonWeight))parts.push(`${formatted(d.cartonWeight)} kg per carton`);
 return parts.join(' · ');
}
export function customerShippingLines(d:Draft,destination?:{country:string;postcode:string}):string[] {
 const {included,method,duties}=shippingOptions(d);
 if(!destination||included!=='Yes'||!SHIPPING_METHODS.includes(method as typeof SHIPPING_METHODS[number]))return [];
 const heading=method==='Domestic'?'Domestic Delivery Included':method==='DDP'?'DDP Delivery Included':`${method} Shipping Included`;
 const lines=[heading];
 if(destination)lines.push(`Deliver to: ${destination.country}${destination.postcode?`, ${destination.postcode}`:''}`);
 const cartons=cartonDescription(d);if(cartons)lines.push(`Shipment: ${cartons}`);
 if(method==='Domestic')lines.push('Includes: Freight and insurance.');
 else if(duties==='Yes')lines.push(method==='DDP'?'Includes: Door-to-door freight, insurance, customs clearance and all applicable import duties, fees and taxes.':'Includes: Freight, insurance, destination customs clearance and all applicable import duties, fees and taxes.');
 else lines.push(method==='DDP'?'Includes: Door-to-door freight and insurance.':'Includes: Freight and insurance.','Excludes: Destination customs clearance, import duties, taxes and destination charges.');
 return lines;
}
