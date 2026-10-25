import {test,expect} from '@playwright/test';
test('Rendered preview, customer edit and approval stop without sending',async({page})=>{
 const requests:string[]=[];page.on('request',r=>requests.push(r.url()));await page.goto('/');
 await expect(page.getByRole('heading',{name:'Harbour Supply',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Generate preview',exact:true}).click();
 const email=page.frameLocator('iframe[title="Rendered customer email"]');
 await expect(email.locator('body')).toContainText('Hi Alex');await expect(email.locator('body')).toContainText('150 × 220mm and 230 × 320mm');await expect(email.locator('body')).toContainText('Patrick Kilbane');
 await page.screenshot({path:test.info().outputPath('reorder-review.png'),fullPage:true});
 await page.getByRole('button',{name:'Edit',exact:true}).click();await page.getByLabel('Subject',{exact:true}).fill('A personal stock check');await page.getByLabel('Email body',{exact:true}).fill('Hi Alex,\n\nA customer-specific adjustment.');await page.getByRole('button',{name:'Save draft changes'}).click();
 await expect(page.locator('.mail-meta')).toContainText('A personal stock check');await page.getByRole('button',{name:'Approve for Phase 3'}).click();await expect(page.getByRole('status')).toContainText('No email was sent');await expect(page.getByRole('button',{name:'Approve for Phase 3'})).toBeDisabled();
 expect(requests.filter(x=>!x.startsWith('http://127.0.0.1:5174')&&!x.startsWith('data:'))).toEqual([]);
});
test('Snooze, skip and pause retain their intended controls',async({page})=>{
 await page.goto('/');await page.locator('.snooze summary').click();await page.getByRole('button',{name:'60 days',exact:true}).click();await page.getByRole('button',{name:'Apply snooze'}).click();await expect(page.locator('.alert.held')).toContainText('Snoozed');
 await page.getByRole('button',{name:'All',exact:true}).click();await page.getByRole('button',{name:/North Studio/}).click();await page.getByRole('button',{name:'Skip cycle'}).click();await expect(page.getByRole('status')).toContainText('profile remains active');
 await page.getByRole('button',{name:/Fieldwork/}).click();await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(page.getByRole('status')).toContainText('manually reactivated');await expect(page.getByRole('button',{name:'Generate preview',exact:true})).toBeDisabled();
});
test('Active/incomplete project blocked, responsive width and footer boundary',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'All',exact:true}).click();await page.getByRole('button',{name:/Active shipment example/}).click();await expect(page.locator('.alert.held')).toContainText('still active');await expect(page.getByRole('button',{name:'Generate preview',exact:true})).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const main=await page.locator('main').boundingBox(),footer=await page.locator('footer').boundingBox();expect(Math.abs((main!.y+main!.height)-footer!.y)).toBeLessThan(1);
});
