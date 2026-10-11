import test from 'node:test';
import assert from 'node:assert/strict';
import {demoDraft} from '../src/mock.ts';
import {calculate} from '../src/costing.ts';
import {validateDraft,toValues} from '../src/adapter.ts';
import {C} from '../src/schema.ts';
import {destination,specificationDescription,supplierDescription,shippingQuote,updateDescriptions} from '../src/customer.ts';
import {supplierCompany,supplierOptions} from '../src/suppliers.ts';

test('shorthand decimal prices calculate and serialize with a leading zero and full precision',()=>{
 const d={...demoDraft(),usdUnit:'.6250',fx:'.75',cbm:'.0050'};
 validateDraft(d);assert.equal(calculate(d).totalUSD,'6300.00');
 const values=toValues(d);assert.equal(values[C.usdUnit],'0.6250');assert.equal(values[C.cbm],'0.0050');assert.equal(values[C.fx],'0.75');
});
test('insurance applies USD minimum on first calculation and remains stable after saving',()=>{
 const d={...demoDraft(),insurance:''};const c=calculate(d);
 assert.equal(c.insuranceUSD,'30');assert.equal(c.insuranceAUD,'45.00');assert.equal(c.landedAUD,'2036.00');
 assert.deepEqual(calculate({...d,insurance:c.insuranceUSD}),c);
 assert.equal(calculate({...d,usdUnit:'2'}).insuranceUSD,'60');
});
test('AU customer wording matches approved multiline example including delivery country and postcode',()=>{
 const d={...demoDraft(),colour:'Black',size:'620mm x 480mm',style:'50mm flap with single adhesive',microns:'80',printing:'one colour printing on two sides'};
 assert.equal(specificationDescription(d,'Australia, 3044'),`Custom-designed Black certified compostable mail satchel
620mm x 480mm and 50mm flap with single adhesive
80 mic thick
One colour printing on two sides
Certified to AS 4736 - Commercially Compostable

DDP Delivery Included: Final delivery cost will be confirmed based on the delivery address and final shipment weight and dimensions.

Includes:
Deliver to: Australia, 3044
Freight, insurance and all applicable import and customs duties, fees and taxes.`);
});
test('UK uses its approved certification and postcode, with no delivery promise when shipping is absent',()=>{
 const d={...demoDraft(),microns:'80'};
 const description=specificationDescription(d,'1 Example Road, London SW1A 1AA, United Kingdom');
 assert.match(description,/OK compost INDUSTRIAL/);assert.doesNotMatch(description,/AS 4736/);assert.match(description,/Deliver to: United Kingdom, SW1A 1AA/);
 assert.match(specificationDescription({...d,microns:'60'},'United Kingdom'),/Certified OK compost HOME/);
 assert.doesNotMatch(specificationDescription({...d,shipping:'0'},'United Kingdom'),/DDP|Includes:/);
 assert.equal(destination('Adelaide SA 5000'),undefined);assert.equal(destination('Australia, United Kingdom'),undefined);
 assert.doesNotMatch(specificationDescription(d,'London SW1A 1AA'),/certified|DDP|OK compost/);
 assert.doesNotMatch(specificationDescription({...d,packaging:'custom product'},'Australia'),/certified compostable|AS 4736/);
});
test('spec changes always update both descriptions atomically',()=>{
 const before=demoDraft(),company={id:'101',name:'Demo customer',shippingAddress:'Australia, 3044'};
 const after=updateDescriptions(before,{...before,microns:'80'},company);
 assert.match(after.customerDesc,/AS 4736/);assert.match(after.supplierDesc,/80 mic thick/);
 const manual=updateDescriptions(before,{...before,microns:'80',customerDesc:'Custom manual wording'},company);
 assert.match(manual.customerDesc,/AS 4736/);assert.match(manual.supplierDesc,/80 mic thick/);
});
test('supplier rename is displayed through stable Company ID without changing persisted dropdown label',()=>{
 const label='Mianyang Jersey Mellon Electronic Commerce Co';const companies=[{id:'2877677987',name:'Renamed vendor'}];
 assert.equal(supplierCompany(label,companies)?.id,'2877677987');assert.deepEqual(supplierOptions([label],companies),[{id:label,name:'Renamed vendor'}]);
 assert.equal(supplierCompany(label,[{id:'9',name:label}]),undefined);
 assert.equal(supplierCompany('Ambiguous',[{id:'1',name:'Ambiguous'},{id:'2',name:'Ambiguous'}]),undefined);
});

test('supplier wording matches requested single specification line',()=>{
 const d={...demoDraft(),quantity:'2000',colour:'Black',size:'620mm x 480mm',style:'50mm flap with single adhesive',microns:'80',printing:'one colour printing on two sides'};
 assert.equal(supplierDescription(d,'Strada Coffee Pty Ltd','Australia, 3044'),`Can you please quote for:
Company: Strada Coffee Pty Ltd
2,000 - Customised Certified to AS 4736 - Commercially Compostable Black mail satchel: one colour printing on two sides - 620mm x 480mm and 50mm flap with single adhesive 80 mic thick

Please include weights and cbm for shipping.`);
});
test('shipping request uses exact stored address and grouped quantities without DDP or prices',()=>{
 const company={id:'1',name:'Flash Graphics',shippingAddress:'Unit 1, 14/18 Chapel Street\nMarrickville\nNSW , 2204\nAustralia'};
 assert.equal(shippingQuote({...demoDraft(),weight:'110',cbm:'.2',quantity:'2000'},company),`Can you quote for sending...
110kgs, 0.2cbm - 2,000 x mail satchel
Flash Graphics
Unit 1, 14/18 Chapel Street
Marrickville
NSW , 2204
Australia`);
 assert.throws(()=>shippingQuote(demoDraft(),{id:'1',name:'No address'}),/shipping address/);
});
