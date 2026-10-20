import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{await page.route('https://api.frankfurter.dev/**',route=>route.fulfill({json:{base:'USD',quote:'AUD',rate:1.4,date:'2026-10-09'}}))});
const demo=async(page:import('@playwright/test').Page)=>{await page.goto('/');await page.getByRole('button',{name:/TEST — Demo packaging quote/}).click()};
test('new shipping defaults, method defaults and manual duties override control only customer wording',async({page})=>{
 await page.goto('/');await expect(page.getByLabel('Shipping Included',{exact:true})).toHaveValue('Yes');await expect(page.getByLabel('Shipping Method',{exact:true})).toHaveValue('DDP');await expect(page.getByLabel('Duties & Taxes Included',{exact:true})).toHaveValue('Yes');
 await page.getByRole('button',{name:/TEST — Demo packaging quote/}).click();const customer=page.getByLabel('Customer description',{exact:true}),total=await page.getByLabel('Shipping total AUD',{exact:true}).inputValue();
 await expect(customer).toHaveValue(/DDP Delivery Included\nDeliver to: Australia, 5000\nIncludes: Door-to-door freight, insurance, customs clearance and all applicable import duties, fees and taxes\./);
 for(const method of ['FOB','EXW','Domestic']){
  await page.getByLabel('Shipping Method',{exact:true}).selectOption(method);await expect(page.getByLabel('Duties & Taxes Included',{exact:true})).toHaveValue('No');
  if(method==='Domestic')await expect(customer).not.toHaveValue(/customs|duties|taxes|import/i);
  else await expect(customer).toHaveValue(/Excludes: Destination customs clearance, import duties, taxes and destination charges\./);
  await expect(customer).toHaveValue(/insurance/);
 }
 await page.getByLabel('Shipping Method',{exact:true}).selectOption('FOB');await page.getByLabel('Duties & Taxes Included',{exact:true}).selectOption('Yes');await expect(customer).toHaveValue(/Includes: Freight, insurance, destination customs clearance and all applicable import duties, fees and taxes/);
 await page.getByLabel('Shipping Included',{exact:true}).selectOption('No');await expect(customer).not.toHaveValue(/Shipping Included|Delivery Included|Deliver to:|Includes:|Excludes:/);await expect(page.getByLabel('Shipping total AUD',{exact:true})).toHaveValue(total);
 await page.getByRole('button',{name:'Save Demo',exact:true}).click();await expect(page.getByText('Demo draft saved for this preview session')).toBeVisible();await page.getByRole('button',{name:/Locked issued example/}).click();await page.getByRole('button',{name:/TEST — Demo packaging quote/}).click();await expect(page.getByLabel('Shipping Included',{exact:true})).toHaveValue('No');await expect(page.getByLabel('Shipping Method',{exact:true})).toHaveValue('FOB');await expect(page.getByLabel('Duties & Taxes Included',{exact:true})).toHaveValue('Yes');
});
test('More Details and carton metadata save, autosave, undo and appear in the right order',async({page})=>{
 await page.clock.install();await demo(page);const more=page.getByLabel('More Details',{exact:true}),customer=page.getByLabel('Customer description',{exact:true}),supplier=page.getByLabel('Supplier description · Internal',{exact:true});
 const y1=(await customer.boundingBox())!.y,y2=(await more.boundingBox())!.y,y3=(await page.getByLabel('Internal notes',{exact:true}).boundingBox())!.y;expect(y2).toBeGreaterThan(y1);expect(y3).toBeGreaterThan(y2);
 await more.fill('Bundle in 100s.\nCall before delivery.');await expect(customer).toHaveValue(/Home Compostable\n\nBundle in 100s\.\nCall before delivery\.\n\nDDP/);await expect(supplier).toHaveValue(/60 mic thick\n\nBundle in 100s\.\nCall before delivery\.\n\nPlease include/);
 await page.getByLabel('Number of cartons',{exact:true}).fill('10');await page.getByLabel('Carton weight (kg)',{exact:true}).fill('11');await page.getByRole('group',{name:'Carton dimensions H × W × L (cm)'}).getByLabel('H',{exact:true}).fill('20');await page.getByLabel('W',{exact:true}).fill('30');await page.getByLabel('L',{exact:true}).fill('40');
 await expect(customer).toHaveValue(/10 cartons · 20 × 30 × 40 cm \(H × W × L\) per carton · 11 kg per carton/);
 await page.getByRole('button',{name:'Save Demo',exact:true}).click();await expect(page.getByText('Demo draft saved for this preview session')).toBeVisible();await page.getByLabel('Autosave after first save').check();await more.fill('Autosaved extra details');await page.clock.fastForward(60000);await expect(page.getByText('Demo changes autosaved')).toBeVisible();
 await page.getByRole('button',{name:'Undo',exact:true}).click();await expect(more).toHaveValue('Bundle in 100s.\nCall before delivery.');await page.getByRole('button',{name:'Redo',exact:true}).click();await expect(more).toHaveValue('Autosaved extra details');await expect(page.locator('.dirty')).toHaveCount(0);
 await page.getByRole('button',{name:/Locked issued example/}).click();await page.getByRole('button',{name:/TEST — Demo packaging quote/}).click();await expect(more).toHaveValue('Autosaved extra details');await expect(page.getByLabel('Number of cartons',{exact:true})).toHaveValue('10');await expect(page.getByLabel('W',{exact:true})).toHaveValue('30');
});
test('newest quotation remains first after editing an older quotation',async({page})=>{
 await page.goto('/');await page.getByLabel('Quote reference',{exact:true}).fill('TEST newest quote');await page.getByRole('button',{name:'Save Demo',exact:true}).click();await expect(page.getByText('Demo draft saved for this preview session')).toBeVisible();await expect(page.locator('.quote-list .quote').first()).toContainText('TEST newest quote');
 await page.getByRole('button',{name:/TEST — Demo packaging quote/}).click();await page.getByLabel('Internal notes',{exact:true}).fill('Recently edited older quote');await page.getByRole('button',{name:'Save Demo',exact:true}).click();await expect(page.getByText('Demo draft saved for this preview session')).toBeVisible();await expect(page.locator('.quote-list .quote').first()).toContainText('TEST newest quote');
});
test('Update and successful Copy show a three-second tick; failed Copy does not',async({page})=>{
 await page.clock.install();await demo(page);await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}}));
 for(const name of ['Update customer description','Update supplier description','Copy customer description','Copy supplier description','Copy Sell Incl Shipping AUD']){
  const button=page.getByRole('button',{name,exact:true});await button.click();await expect(button.locator('.action-success')).toHaveCount(1);await page.clock.fastForward(3100);await expect(button.locator('.action-success')).toHaveCount(0);
 }
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Denied')}}}));const copy=page.getByRole('button',{name:'Copy customer description',exact:true});await copy.click();await expect(page.getByRole('alert')).toContainText('Clipboard access is unavailable');await expect(copy.locator('.action-success')).toHaveCount(0);
});
test('new controls preserve responsive layout and footer boundary',async({page},testInfo)=>{
 await demo(page);await page.locator('.carton-fields').scrollIntoViewIfNeeded();await page.screenshot({path:testInfo.outputPath(`shipping-${testInfo.project.name}.png`)});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByLabel('More Details',{exact:true}).scrollIntoViewIfNeeded();await expect(page.getByLabel('More Details',{exact:true})).toBeVisible();await page.locator('footer').scrollIntoViewIfNeeded();const edge=await page.evaluate(()=>{const panel=document.querySelector('.content>.panel')!,footer=document.querySelector('footer')!;return footer.getBoundingClientRect().top-panel.getBoundingClientRect().bottom});expect(edge).toBeLessThanOrEqual(16);
});
