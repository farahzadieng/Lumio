import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto('http://127.0.0.1:5173/');await page.getByRole('button',{name:'ادامه'}).click();await page.getByRole('textbox',{name:'نام عادت'}).fill('تمرین');await page.getByRole('button',{name:'📚',exact:true}).click();await page.getByRole('button',{name:'ذخیره',exact:true}).click();
await page.evaluate(async()=>{const {db}=await import('/src/model/db.ts');const {shiftDay,dayKey}=await import('/src/model/habits.ts');const h=(await db.habits.toArray())[0];await db.habits.update(h.id,{startDayKey:shiftDay(dayKey(),-1)})});
await page.getByRole('button',{name:'انجام شد: تمرین'}).click();await page.getByRole('button',{name:'مسیر من',exact:true}).click();await page.getByRole('button',{name:'دیروز',exact:true}).click();await page.getByRole('button',{name:'ثبت دیروز',exact:true}).click();await page.waitForTimeout(500);
const remaining=await page.getByRole('button',{name:'ثبت دیروز',exact:true}).count();const symbols=await page.locator('.calendar-stamps>span').count();await page.screenshot({path:'test-artifacts/redesign-yesterday.png',fullPage:true});
await page.getByRole('button',{name:'امروز',exact:true}).first().click();await page.waitForTimeout(600);
const data=await page.evaluate(async()=>{const {db}=await import('/src/model/db.ts');return {completions:await db.completions.count(),emoji:(await db.habits.toArray())[0].emoji}});console.log({remaining,symbols,...data});await browser.close();
