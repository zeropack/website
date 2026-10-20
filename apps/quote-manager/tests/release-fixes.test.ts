import test from 'node:test';
import assert from 'node:assert/strict';
import {demoDraft} from '../src/mock.ts';
import {calculate} from '../src/costing.ts';
import {validateDraft,toValues} from '../src/adapter.ts';
import {C} from '../src/schema.ts';
import {certification,destination,generatedDescriptions,specificationDescription,supplierDescription,shippingDetails,updateDescriptions} from '../src/customer.ts';
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

DDP Delivery Included
Deliver to: Australia, 3044
Includes: Door-to-door freight, insurance, customs clearance and all applicable import duties, fees and taxes.`);
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
test('US soft packaging through 70 microns uses ASTM D 6400 in both descriptions and delivery destination',()=>{
 const address='100 Main Street, New York NY 10001, United States of America';
 const d={...demoDraft(),packaging:'mail satchel',microns:'70',colour:'Black'};
 assert.deepEqual(destination(address),{country:'United States',postcode:'10001'});
 assert.equal(certification(d,address),'Certified to ASTM D 6400 - Industrially Compostable');
 assert.match(specificationDescription(d,address),/Certified to ASTM D 6400 - Industrially Compostable\n\nDDP Delivery Included[\s\S]*Deliver to: United States, 10001/);
 assert.match(supplierDescription(d,'US customer',address),/Customised Certified to ASTM D 6400 - Industrially Compostable/);
 assert.equal(certification({...d,microns:'63'},address),'Certified to ASTM D 6400 - Industrially Compostable');
 assert.equal(certification({...d,microns:'70.1'},address),'');
 assert.doesNotMatch(specificationDescription({...d,microns:'70.1'},address),/certified compostable|ASTM/);
 assert.equal(certification({...d,packaging:'cardboard box'},address),'');
 assert.deepEqual(destination('100 Main Street, NY 10001 USA'),{country:'United States',postcode:'10001'});
 assert.deepEqual(destination('100 Main Street, CA 94105-1234 US'),{country:'United States',postcode:'94105-1234'});
 assert.equal(destination('New York NY 10001'),undefined);
 assert.equal(destination('10001 United States Avenue'),undefined);
 assert.equal(destination('United States, Australia'),undefined);
 assert.equal(certification(d,'New York NY 10001'),'');
 const company={id:'2879721039',name:'US customer',shippingAddress:'826 Kern St Missoula, MT 59801',shippingCountry:'US'};
 assert.deepEqual(destination(company.shippingAddress,company.shippingCountry),{country:'United States',postcode:'59801'});
 const generated=generatedDescriptions({...d,microns:'60'},company);
 assert.match(generated.customerDesc,/Certified to ASTM D 6400 - Industrially Compostable[\s\S]*Deliver to: United States, 59801/);
 assert.match(generated.supplierDesc,/Customised Certified to ASTM D 6400 - Industrially Compostable/);
 assert.equal(destination(company.shippingAddress),undefined);
 assert.equal(destination('100 Main Street, Australia','US'),undefined);
 assert.equal(destination(company.shippingAddress,'CA'),undefined);
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

test('supplier wording matches requested multiline layout',()=>{
 const d={...demoDraft(),quantity:'2000',colour:'Black',size:'620mm x 480mm',style:'50mm flap with single adhesive',microns:'80',printing:'one colour printing on two sides'};
 assert.equal(supplierDescription(d,'Strada Coffee Pty Ltd','Australia, 3044'),`Can you please quote for:
Company: Strada Coffee Pty Ltd
2,000 - Customised Certified to AS 4736 - Commercially Compostable
Black mail satchel
one colour printing on two sides
620mm x 480mm
50mm flap with single adhesive
80 mic thick

Please include weights and cbm for shipping.`);
});
test('shipping details copy recipient, phone, company, exact address and weights without product quantities',()=>{
 const company={id:'1',name:'Second Skin',companyPhone:'+61892019455',shippingAddress:'40 O’Malley Street Osborne Park WA , 6017 Australia'};
 const contact={id:'2',name:'Christina Roberts',firstName:'Christina',lastName:'Roberts',companyIds:['1']};
 const d={...demoDraft(),weight:'93',cbm:'.1',quantity:'',packaging:''};
 assert.equal(shippingDetails(d,company,contact),`Please ship to:
Christina Roberts
+61892019455
Second Skin
40 O’Malley Street Osborne Park WA , 6017 Australia
93kgs, 0.1cbm`);
 assert.doesNotMatch(shippingDetails(d,company,{...contact,companyIds:['9']}),/Christina/);
 assert.match(shippingDetails(d,company,{...contact,phone:'+61400000000'}),/\+61400000000/);
 assert.throws(()=>shippingDetails(d,{id:'1',name:'No address'}),/shipping address/);
 assert.throws(()=>shippingDetails({...d,cbm:'bad'},company),/valid/);
});

test('Monday postcode-before-country shipping address resolves AU certification and DDP',()=>{
 const address='Factory 4, 39 Example Street Pascoe Vale VIC , 3044 Australia';
 assert.deepEqual(destination(address),{country:'Australia',postcode:'3044'});
 const d={...demoDraft(),microns:'80'};assert.match(specificationDescription(d,address),/Certified to AS 4736 - Commercially Compostable/);assert.match(specificationDescription(d,address),/Deliver to: Australia, 3044/);assert.match(supplierDescription(d,'Example company',address),/Certified to AS 4736/);
 assert.equal(destination('3044 Australia Street'),undefined);
 assert.deepEqual(destination('1 Example Road, SW1A 1AA United Kingdom'),{country:'United Kingdom',postcode:'SW1A 1AA'});
 assert.match(specificationDescription(d,'1 Example Road, SW1A 1AA United Kingdom'),/OK compost INDUSTRIAL/);
});


test('explicit Industry overrides thin Home classification in both AU and UK descriptions',()=>{
 const home={...demoDraft(),compostability:'Home',microns:'30'};
 for(const [country,homeText,industryText] of [['Australia','AS 5810','AS 4736'],['United Kingdom','OK compost HOME','OK compost INDUSTRIAL']]){
  const company={id:'101',name:'Test company',shippingAddress:country};
  const changed=updateDescriptions(home,{...home,compostability:'Industry'},company);
  assert.match(changed.customerDesc,new RegExp(industryText));assert.match(changed.supplierDesc,new RegExp(industryText));
  const restored=updateDescriptions(changed,{...changed,compostability:'Home'},company);
  assert.match(restored.customerDesc,new RegExp(homeText));assert.match(restored.supplierDesc,new RegExp(homeText));
 }
});
test('Home cannot create a named claim outside its approved thickness or US coverage',()=>{
 const d={...demoDraft(),compostability:'Home',microns:'60'};
 assert.equal(certification(d,'United States'),'');assert.equal(certification({...d,microns:'80'},'Australia'),'');
 assert.match(certification({...d,compostability:'Industry'},'United States'),/ASTM D 6400/);
 assert.equal(certification({...d,compostability:'Industry',microns:'71'},'United States'),'');
 assert.equal(certification({...d,compostability:'Unexpected'},'Australia'),'');
 assert.throws(()=>validateDraft({...d,compostability:'Unexpected'}),/Compostability/);
});
test('new quotes default Home and the selected choice survives Monday serialization and decoding',async()=>{
 const {newQuote}=await import('../src/exchange-rate.ts');const {decode,duplicateDraft}=await import('../src/adapter.ts');
 assert.equal(newQuote().compostability,'Home');
 for(const choice of ['Home','Industry']){
  const d={...demoDraft(),compostability:choice};assert.deepEqual(toValues(d)[C.compostability],{labels:[choice]});
  const row=decode({id:'1',name:'TEST',updated_at:'2026-10-19',column_values:[{id:C.compostability,type:'dropdown',text:choice,value:null,values:[{id:1,label:choice}]}]});
  assert.equal(row.values.compostability,choice);assert.equal(duplicateDraft(d).compostability,choice);
 }
});
test('legacy quotes keep their previous classification until a manual choice is saved',async()=>{
 const {quoteCompostability}=await import('../src/customer.ts');
 const d={...demoDraft(),compostability:'',microns:'60'};
 assert.equal(quoteCompostability(d,'Australia'),'Home');assert.equal(quoteCompostability({...d,microns:'80'},'Australia'),'Industry');
 assert.equal(quoteCompostability(d,'United States'),'Industry');
 assert.equal(quoteCompostability({...d,customerDesc:'Certified to AS 4736 - Commercially Compostable'},'Australia'),'Industry');
 assert.equal(quoteCompostability({...d,compostability:'Home'},'United States'),'Home');
});
