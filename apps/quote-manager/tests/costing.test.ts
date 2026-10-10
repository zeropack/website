import test from 'node:test';import assert from 'node:assert/strict';
import {calculate,applyCosting,PRICING_VERSION} from '../src/costing.ts';import {demoDraft} from '../src/mock.ts';import {customerQuotation,specificationDescription} from '../src/customer.ts';
test('Access fixture: product markup plus pass-through freight with USD bank fees',()=>{const c=calculate(demoDraft());assert.equal(c.audUnit,'0.1500');assert.equal(c.insuranceUSD,'30');assert.equal(c.productCostAUD,'1550.00');assert.equal(c.freightAUD,'461.00');assert.equal(c.landedAUD,'2011.00');assert.equal(c.productSellUnitAUD,'0.2015');assert.equal(c.productSellAUD,'2015.00');assert.equal(c.allInUnitAUD,'0.2476');assert.equal(c.allInTotalAUD,'2476.00');assert.equal(c.profitAUD,'465.00')});
test('insurance at half integer uses VBA bankers rounding',()=>{const c=calculate({...demoDraft(),usdUnit:'1',sellQuantity:'10500',quantity:'10500',insurance:'0'});assert.equal(c.insuranceUSD,'32')});
test('zero shipping with a positive seed preserves legacy minimum',()=>assert.equal(calculate({...demoDraft(),shipping:'0',insurance:'30'}).insuranceUSD,'30'));
test('zero insurance seed permits below-minimum calculated insurance',()=>assert.equal(calculate({...demoDraft(),insurance:'0'}).insuranceUSD,'3'));
test('sell quantity drives product total, supplier quantity drives all-in unit',()=>{const c=calculate({...demoDraft(),quantity:'20000'});assert.equal(c.productCostAUD,'1550.00');assert.equal(c.allInUnitAUD,'0.1238')});
test('incomplete and zero quantities produce actionable errors',()=>{for(const patch of [{fx:''},{sellQuantity:'0'},{quantity:'0'},{quantity:'1.5'},{usdUnit:'-1'}])assert.throws(()=>calculate({...demoDraft(),...patch}))});
test('large insurance fails instead of reproducing silent Access integer overflow',()=>assert.throws(()=>calculate({...demoDraft(),usdUnit:'10000'}),/Integer range/));
test('applying calculation does not overwrite snapshot or descriptions',()=>{const d=demoDraft();const changed=applyCosting(d,calculate(d));assert.equal(changed.fx,d.fx);assert.equal(changed.customerDesc,d.customerDesc);assert.equal(changed.pricingVersion,PRICING_VERSION)});
test('customer DTO excludes supplier costs, FX and internal notes',()=>{const dto=customerQuotation(demoDraft());assert.deepEqual(Object.keys(dto),['reference','description','quantity','unitPriceAUD','artwork']);assert.ok(!JSON.stringify(dto).includes('INTERNAL'));assert.ok(!('fx' in dto));assert.ok(!('landed' in dto))});
test('description generator needs a destination for named certification and never adds DDP claims',()=>{const s=specificationDescription({...demoDraft(),packaging:'custom product'});assert.ok(!/certified|DDP|compostable/i.test(s));assert.match(s,/Qty 10,000/)});

test('insurance AUD and detailed totals derive from the saved FX snapshot',()=>{
 const d=demoDraft(),c=calculate(d);assert.equal(c.insuranceUSD,'30');assert.equal(c.insuranceAUD,'45.00');assert.equal(c.totalUSD,'1000.00');assert.equal(c.totalAUD,'1500.00');assert.equal(c.costUnitAUD,'0.1550');
});
