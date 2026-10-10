import Decimal from 'decimal.js';
import type {Draft} from './schema.ts';
export const PRICING_VERSION = 'access-v1-bank-usd-20261010';
export type Costing = {audUnit:string; totalUSD:string; totalAUD:string; costUnitAUD:string; insuranceUSD:string; insuranceAUD:string; productCostAUD:string; freightAUD:string; landedAUD:string; productSellUnitAUD:string; productSellAUD:string; allInUnitAUD:string; allInTotalAUD:string; profitAUD:string; marginPercent:string};
const decimal = (value:string, field:string) => {
 if(!/^\d+(\.\d+)?$/.test(value)) throw new Error(`${field} requires a non-negative decimal number.`);
 const n=new Decimal(value); if(!n.isFinite()) throw new Error(`${field} is invalid.`); return n;
};
const fixed=(n:Decimal, places=4)=>n.toDecimalPlaces(places,Decimal.ROUND_HALF_EVEN).toFixed(places);
export function calculate(d: Draft): Costing {
 const usd=decimal(d.usdUnit,'USD unit price'), fx=decimal(d.fx,'FX snapshot');
 const quantity=decimal(d.quantity,'Supplier quantity'), sellQuantity=decimal(d.sellQuantity,'Sell quantity');
 if(fx.lte(0)||quantity.lte(0)||sellQuantity.lte(0)) throw new Error('FX and both quantities must be greater than zero.');
 if(!quantity.isInteger()||!sellQuantity.isInteger()) throw new Error('Quantities must be whole numbers.');
 const optional=(k:keyof Draft)=>decimal(d[k]||'0',k);
 const aud=usd.mul(fx), totalUSD=usd.mul(sellQuantity);
 // Access: shipins declared Integer, VBA coercion rounds half to even, then minimum logic.
 const shipins=optional('shipping').gt(0)?totalUSD.mul('0.003').toDecimalPlaces(0,Decimal.ROUND_HALF_EVEN):new Decimal(0);
 if(shipins.gt(32767)) throw new Error('Legacy insurance exceeds the Access Integer range. Review costing manually.');
 const insurance=shipins.lt(30)&&optional('insurance').gt(0)?new Decimal(30):shipins;
 const productCost=aud.mul(sellQuantity).plus(optional('transaction'));
 // User confirmed bank fees use legacy USD despite existing Monday column title.
 const freight=optional('shipping').plus(insurance).plus(optional('bank')).mul(fx).plus(optional('customs')).plus(optional('duty'));
 const productSellUnit=productCost.mul(optional('markup').div(100).plus(1)).div(sellQuantity).toDecimalPlaces(4,Decimal.ROUND_HALF_EVEN);
 const productSell=productSellUnit.mul(sellQuantity), allInTotal=freight.plus(productSell), profit=productSell.minus(productCost);
 return {audUnit:fixed(aud),totalUSD:fixed(totalUSD,2),totalAUD:fixed(aud.mul(sellQuantity),2),costUnitAUD:fixed(productCost.div(sellQuantity)),insuranceUSD:fixed(insurance,0),insuranceAUD:fixed(insurance.mul(fx),2),productCostAUD:fixed(productCost,2),freightAUD:fixed(freight,2),landedAUD:fixed(productCost.plus(freight),2),productSellUnitAUD:fixed(productSellUnit),productSellAUD:fixed(productSell,2),allInUnitAUD:fixed(allInTotal.div(quantity)),allInTotalAUD:fixed(allInTotal,2),profitAUD:fixed(profit,2),marginPercent:fixed(productSell.gt(0)?profit.div(productSell).mul(100):new Decimal(0),2)};
}
export function applyCosting(d:Draft,c:Costing):Draft {
 return {...d,audUnit:c.audUnit,insurance:c.insuranceUSD,landed:c.landedAUD,sellUnit:c.productSellUnitAUD,pricingVersion:PRICING_VERSION};
}
