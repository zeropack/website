// Accept shorthand decimals without losing typed precision.
export const normalizeDecimal=(value:string)=>value.trim().replace(/^\.(\d)/,'0.$1').replace(/^(\d+)\.$/,'$1');
export const isDecimal=(value:string)=>/^\d+(\.\d+)?$/.test(normalizeDecimal(value))&&Number.isFinite(Number(normalizeDecimal(value)));
