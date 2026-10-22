import test from 'node:test';
import assert from 'node:assert/strict';
import {blank,C} from '../src/schema.ts';
import {newQuote} from '../src/exchange-rate.ts';
import {demoDraft} from '../src/mock.ts';
import {decode,toValues,validateDraft,newestQuotes,type Quote} from '../src/adapter.ts';
import {generatedDescriptions,specificationDescription,supplierDescription,updateDescriptions,shippingDetails} from '../src/customer.ts';
import {shippingOptions,withShippingDefaults,customerShippingLines,defaultDuties} from '../src/shipping.ts';
import {calculate} from '../src/costing.ts';
const company={id:'101',name:'Example customer',shippingAddress:'Australia, 3044'};
const destination={country:'Australia',postcode:'3044'};
const draft=()=>({...demoDraft(),shippingIncluded:'Yes',shippingMethod:'DDP',dutiesIncluded:'Yes'});
test('new quote defaults and legacy no-shipping defaults are compatible',()=>{
 assert.deepEqual(shippingOptions(newQuote()),{included:'Yes',method:'DDP',duties:'Yes'});
 assert.deepEqual(shippingOptions({...blank(),shipping:'100'}),{included:'Yes',method:'DDP',duties:'Yes'});
 assert.deepEqual(shippingOptions({...blank(),shipping:'0'}),{included:'No',method:'DDP',duties:'Yes'});
 assert.equal(withShippingDefaults({...blank(),shipping:'',shippingMethod:'FOB'}).dutiesIncluded,'No');
 for(const method of ['FOB','EXW','Domestic'])assert.equal(defaultDuties(method),'No');
 assert.equal(defaultDuties('DDP'),'Yes');
});
test('DDP matches requested wording and shipping visibility is independent of freight price',()=>{
 assert.equal(customerShippingLines(draft(),destination).join('\n'),'DDP Delivery Included\nDeliver to: Australia, 3044\nIncludes: Door-to-door freight, insurance, customs clearance and all applicable import duties, fees and taxes.');
 assert.match(specificationDescription({...draft(),shipping:'0'},company.shippingAddress),/DDP Delivery Included/);
 const noShipping=specificationDescription({...draft(),shippingIncluded:'No'},company.shippingAddress);
 assert.doesNotMatch(noShipping,/DDP|Deliver to:|Includes:|insurance|Excludes:/);
 assert.equal(customerShippingLines(draft(),undefined).length,0);
 assert.match(noShipping,/AS 5810/);
});
for(const method of ['DDP','FOB','EXW','Domestic'])for(const duties of ['Yes','No'])test(`${method}, duties ${duties}: insurance always included and import claims match selection`,()=>{
 const d={...draft(),shippingMethod:method,dutiesIncluded:duties};
 const output=customerShippingLines(d,destination).join('\n');
 assert.match(output,/insurance/);assert.match(output,/Deliver to: Australia, 3044/);
 if(method==='Domestic')assert.doesNotMatch(output,/customs|duties|taxes|import/i);
 else if(duties==='Yes'){assert.match(output,/Includes:.*customs clearance and all applicable import duties, fees and taxes/);assert.doesNotMatch(output,/Excludes:/)}
 else {assert.match(output,/Excludes: Destination customs clearance, import duties, taxes and destination charges\./);assert.doesNotMatch(output,/Includes:.*(?:duties|taxes|customs)/)}
 assert.deepEqual(calculate(d),calculate(draft()));
});
test('More Details preserves multiline text once after packaging and before shipping in both descriptions',()=>{
 const d={...draft(),moreDetails:'Pack in bundles of 100.\nCall before delivery.',notes:'PRIVATE NOTE'};
 const customer=specificationDescription(d,company.shippingAddress),supplier=supplierDescription(d,company.name,company.shippingAddress);
 assert.ok(customer.indexOf('Home Compostable')<customer.indexOf(d.moreDetails));assert.ok(customer.indexOf(d.moreDetails)<customer.indexOf('DDP Delivery Included'));
 assert.ok(supplier.indexOf('60 mic thick')<supplier.indexOf(d.moreDetails));assert.ok(supplier.indexOf(d.moreDetails)<supplier.indexOf('Please include weights'));
 for(const text of [customer,supplier]){assert.equal(text.split(d.moreDetails).length,2);assert.doesNotMatch(text,/PRIVATE NOTE/)}
 const changed=updateDescriptions(d,{...d,moreDetails:'New details'},company);assert.match(changed.customerDesc,/New details/);assert.match(changed.supplierDesc,/New details/);
 const cleared=generatedDescriptions({...d,moreDetails:''},company);assert.doesNotMatch(cleared.customerDesc,/Call before delivery/);
});
test('carton details describe optional shipment metadata without changing total weight, CBM or costing',()=>{
 const d={...draft(),weight:'110',cbm:'.2',cartonCount:'10',cartonHeight:'20',cartonWidth:'30',cartonLength:'40',cartonWeight:'11'};
 assert.match(specificationDescription(d,company.shippingAddress),/Shipment: 10 cartons · 20 × 30 × 40 cm \(H × W × L\) per carton · 11 kg per carton/);
 assert.match(shippingDetails(d,company),/110kgs, 0\.2cbm\n10 cartons/);
 assert.doesNotMatch(specificationDescription({...d,shippingIncluded:'No'},company.shippingAddress),/Shipment:|cartons|per carton/);
 assert.deepEqual(calculate(d),calculate(draft()));
 validateDraft(d);assert.throws(()=>validateDraft({...d,cartonCount:'1.5'}),/whole number/);assert.throws(()=>validateDraft({...d,cartonWeight:'-1'}),/non-negative/);
 assert.doesNotMatch(specificationDescription({...d,cartonWidth:''},company.shippingAddress),/H × W × L/);
});
test('all new fields survive native Monday value serialization and decoding',()=>{
 const d={...draft(),moreDetails:'Line 1\nLine 2',cartonCount:'10',cartonHeight:'.5',cartonWidth:'30',cartonLength:'40',cartonWeight:'11',shippingMethod:'FOB',dutiesIncluded:'Yes'};
 const fields=['moreDetails','cartonCount','cartonHeight','cartonWidth','cartonLength','cartonWeight','shippingIncluded','shippingMethod','dutiesIncluded'] as const;
 const values=toValues(d);assert.deepEqual(values[C.moreDetails],{text:d.moreDetails});assert.equal(values[C.cartonHeight],'0.5');
 const row=decode({id:'1',name:d.name,created_at:'2026-10-20T00:00:00Z',updated_at:'2026-10-20T01:00:00Z',column_values:fields.map(k=>({id:C[k],type:'text',text:d[k],value:null}))});
 for(const field of fields)assert.equal(row.values[field],d[field]);assert.equal(row.created_at,'2026-10-20T00:00:00Z');
 const legacy=decode({id:'2',name:'Legacy',updated_at:'2026-10-20',column_values:[]});assert.equal(legacy.values.shippingIncluded,'No');assert.equal(legacy.values.moreDetails,'');
 assert.throws(()=>validateDraft({...d,shippingIncluded:'Maybe'}),/Yes or No/);assert.throws(()=>validateDraft({...d,shippingMethod:'Unknown'}),/Choose DDP/);
});
test('newest quotes sorts creation dates descending, uses safe fallbacks and never reorders on a recent autosave',()=>{
 const row=(id:string,created_at?:string,updated_at='2026-10-19'):Quote=>({id,name:id,values:blank(),created_at,updated_at});
 const older=row('1','2026-10-18','2026-10-25'),newer=row('2','2026-10-20'),middle=row('3',undefined,'2026-10-19'),unknown=row('4','bad','bad');
 const rows=[older,newer,middle,unknown];assert.deepEqual(newestQuotes(rows).map(r=>r.id),['2','3','1','4']);assert.equal(rows[0],older);
});
