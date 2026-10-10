import {blank,C,COMPANY_BOARD_ID,CONTACT_BOARD_ID,DEAL_BOARD_ID,PROJECT_BOARD_ID,type Draft} from './schema.ts';
import {duplicateDraft,validateDraft,type Quote,type Ref} from './adapter.ts';
import {applyCosting,calculate} from './costing.ts';
export const demoDraft=():Draft=>applyCosting({...blank(),name:'TEST — Demo packaging quote',status:'Draft',company:'101',contact:'201',supplierContact:'202',supplierDropdown:'Demo supplier',packaging:'mail satchel',size:'300 × 400 mm',microns:'60',style:'Demo flap',colour:'White',printing:'one colour printing on one side',quantity:'10000',sellQuantity:'10000',usdUnit:'0.10',fx:'1.5',shipping:'100',insurance:'30',bank:'20',transaction:'50',customs:'116',duty:'120',markup:'30',fxSource:'Demo snapshot — 2026-10-10 (AUD per USD)',customerDesc:'Demo packaging · 300 × 400 mm · white · 10,000 units',supplierDesc:'INTERNAL DEMO supplier specification',notes:'Synthetic preview data only',visibility:'Private',artwork:'DEMO-DESIGN-01'},calculate({...blank(),quantity:'10000',sellQuantity:'10000',usdUnit:'0.10',fx:'1.5',shipping:'100',insurance:'30',bank:'20',transaction:'50',customs:'116',duty:'120',markup:'30'}));
const lookups={[C.packaging]:['mail satchel','custom product'],[C.style]:['Demo flap','Flat bag'],[C.colour]:['White','Black'],[C.printing]:['one colour printing on one side','no printing'],[C.supplierDropdown]:['Demo supplier']};
const references:Record<number,Ref[]>={
 [COMPANY_BOARD_ID]:[{id:'101',name:'Demo customer',status:'Client',primaryContactIds:['201'],shippingAddress:'10 Example Street, Adelaide SA 5000, Australia',companyPhone:'08 0000 0000'},{id:'102',name:'Demo supplier',status:'Supplier'}],
 [CONTACT_BOARD_ID]:[{id:'201',name:'Demo customer contact',companyIds:['101'],firstName:'Demo',lastName:'Contact',email:'customer@example.com',phone:'0400 000 000'},{id:'202',name:'Demo supplier contact',companyIds:['102']},{id:'203',name:'Unlinked demo contact',companyIds:[]}],
 [DEAL_BOARD_ID]:[{id:'301',name:'Demo opportunity'}], [PROJECT_BOARD_ID]:[{id:'401',name:'Demo project'}]
};
export function createMockAdapter() {
 let sequence=1000;
 let rows:Quote[]=[{id:'901',name:demoDraft().name,values:demoDraft(),updated_at:'2026-10-10T00:00:00Z'}, {id:'902',name:'TEST — Locked issued example',values:{...demoDraft(),name:'TEST — Locked issued example',status:'Issued'},updated_at:'2026-10-10T00:00:00Z'}];
 const clone=()=>structuredClone(rows);
 return {
  fetchColumns:async()=>structuredClone(lookups),loadQuotes:async()=>clone(),loadRefs:async(board:number)=>structuredClone(references[board]??[]),
  saveQuote:async(d:Draft,id?:string,expectedUpdatedAt?:string)=>{
   validateDraft(d); const prior=rows.find(r=>r.id===id);
   if(id&&(!prior||prior.updated_at!==expectedUpdatedAt)) throw new Error('Reload this quote before saving.');
   if(prior&&prior.values.status==='Issued') throw new Error('Quotation is locked.');
   const key=id||String(++sequence), now=new Date().toISOString();
   const row={id:key,name:d.name,values:structuredClone(d),updated_at:now};
   rows=id?rows.map(r=>r.id===key?row:r):[...rows,row]; return key;
  }
 };
}
export {duplicateDraft};
