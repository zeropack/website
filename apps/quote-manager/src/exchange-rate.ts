import Decimal from 'decimal.js';
import {blank,type Draft} from './schema.ts';
export const FX_URL='https://api.frankfurter.dev/v2/providers/ecb/rate/usd/aud';
export type ExchangeRate={base:string;adjusted:string;date:string;source:string};
export function parseExchangeRate(data:unknown):ExchangeRate {
 if(!data||typeof data!=='object')throw new Error('Invalid exchange-rate response.');
 const row=data as Record<string,unknown>;
 if(row.base!=='USD'||row.quote!=='AUD'||typeof row.rate!=='number'||!Number.isFinite(row.rate)||row.rate<=0||typeof row.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(row.date)||!Number.isFinite(Date.parse(row.date)))throw new Error('Invalid USD/AUD exchange rate.');
 const base=new Decimal(row.rate).toString(),adjusted=new Decimal(base).mul('1.05').toDecimalPlaces(6,Decimal.ROUND_HALF_EVEN).toString();
 return {base,adjusted,date:row.date,source:`ECB via Frankfurter · ${row.date} · USD/AUD ${base} + 5% allowance`};
}
export async function fetchExchangeRate():Promise<ExchangeRate>{
 const response=await fetch(FX_URL,{signal:AbortSignal.timeout(10000),cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});
 if(!response.ok)throw new Error('Exchange-rate lookup unavailable.');
 return parseExchangeRate(await response.json());
}
export function newQuote(rate?:ExchangeRate):Draft{return {...blank(),status:'Draft',visibility:'Private',duty:'120',customs:'116',fx:rate?.adjusted??'',fxSource:rate?.source??''};}
export function rateColour(selected:string,rate?:ExchangeRate):string {
 if(!rate||!/^\d+(\.\d+)?$/.test(selected)||new Decimal(selected).lte(0))return '';
 const comparison=new Decimal(rate.base).cmp(selected);return comparison>0?'rate-higher':comparison<0?'rate-lower':'';
}
