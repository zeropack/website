import type {Draft} from './schema.ts';
// Explicit allowlist: never return supplier names, descriptions, costs, FX, notes or markup.
// Future portal must produce this DTO server-side after authorization, never fetch internal drafts.
export function customerQuotation(d:Draft) {
 return {reference:d.name,description:d.customerDesc,quantity:d.sellQuantity,unitPriceAUD:d.sellUnit,artwork:d.artwork};
}
export function specificationDescription(d:Draft) {
 return [d.packaging,d.size,d.microns?`${d.microns} microns`:'',d.style,d.colour,d.printing,d.sellQuantity?`Qty ${Number(d.sellQuantity).toLocaleString('en-AU')}`:''].filter(Boolean).join(' · ');
}
