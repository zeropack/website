// Formatting affects display only. Raw decimal strings remain in the draft and save payload.
export function currencyValue(value:string,currency:'USD'|'AUD',places=2):string {
 if(!/^\d+(\.\d+)?$/.test(value))return value;
 const number=Number(value);if(!Number.isFinite(number))return value;
 return new Intl.NumberFormat('en-AU',{style:'currency',currency,currencyDisplay:'narrowSymbol',minimumFractionDigits:places,maximumFractionDigits:places}).format(number);
}

export function numberValue(value:string):string {
 if(!/^\d+(\.\d+)?$/.test(value))return value;
 const [whole,fraction]=value.split('.');
 return whole.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(fraction===undefined?'':`.${fraction}`);
}
