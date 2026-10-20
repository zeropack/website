export const QUOTE_BOARD_ID = 5031824429;
export const COMPANY_BOARD_ID = 5029468202;
export const CONTACT_BOARD_ID = 5029468199;
export const DEAL_BOARD_ID = 5029468200;
export const PROJECT_BOARD_ID = 5029468197;

export const C = {
  name:'name', packaging:'dropdown_mm80zpyn', style:'dropdown_mm801np7', colour:'dropdown_mm80p60e', printing:'dropdown_mm80xrbe',
  legacy:'text_mm80f47r', status:'color_mm80bt0p', company:'board_relation_mm80n2mm', contact:'board_relation_mm80w4ss',
  deal:'board_relation_mm80hhej', project:'board_relation_mm80kj32', supplierContact:'board_relation_mm80sg03',
  supplierDropdown:'dropdown_mm801r0y', size:'text_mm805hmn',microns:'numeric_mm80a7nq', compostability:'dropdown_mm894qgc', quantity:'numeric_mm80gbsh',
  sellQuantity:'numeric_mm809hzq',usdUnit:'numeric_mm8047kn',fx:'numeric_mm80cnzb',audUnit:'numeric_mm80m9g2',
  shipping:'numeric_mm80yzmm',insurance:'numeric_mm80maq6', transaction:'numeric_mm803ee8',bank:'numeric_mm80q158',
  duty:'numeric_mm805nza',customs:'numeric_mm804y4c',markup:'numeric_mm80syck',landed:'numeric_mm80pr8h',
  sellUnit:'numeric_mm807qhm',customerDesc:'long_text_mm80gcmd',supplierDesc:'long_text_mm8045f7',
  pricingVersion:'text_mm80aph1',fxSource:'text_mm80qh91',notes:'long_text_mm806pr6',visibility:'color_mm804dbz',
  qboId:'text_mm80knsp',qboUrl:'link_mm80342x',weight:'numeric_mm80kkse',cbm:'numeric_mm80g7sz',
  artwork:'text_mm80grd8',moreDetails:'long_text_mm8am81s',
  cartonCount:'numeric_mm8a3m69',cartonHeight:'numeric_mm8a8dx0',cartonWidth:'numeric_mm8aszjn',cartonLength:'numeric_mm8a5r7h',cartonWeight:'numeric_mm8ant1',
  shippingIncluded:'dropdown_mm8ayw9y',shippingMethod:'dropdown_mm8amsvj',dutiesIncluded:'dropdown_mm8ahaqq'
} as const;
export type Field = keyof typeof C;
export type Draft = Record<Field,string>;
export const blank = ():Draft => Object.fromEntries(Object.keys(C).map(k=>[k,''])) as Draft;
export const numbers:Field[]=['cartonCount','cartonHeight','cartonWidth','cartonLength','cartonWeight','microns','quantity','sellQuantity','usdUnit','fx','audUnit','shipping','insurance','transaction','bank','duty','customs','markup','landed','sellUnit','weight','cbm'];
export const dropdowns:Field[]=['shippingIncluded','shippingMethod','dutiesIncluded','compostability','packaging','style','colour','printing','supplierDropdown'];
export const relations:Field[]=['company','contact','deal','project','supplierContact'];
export const longs:Field[]=['moreDetails','notes','customerDesc','supplierDesc'];
export const statuses:Field[]=['status','visibility'];

