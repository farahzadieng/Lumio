import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
await page.goto((process.env.LUMIO_URL || 'http://127.0.0.1:5173/'));await page.getByRole('button',{name:'ادامه'}).click();
for(const [name,emoji] of [['مطالعه','📚'],['آب خوردن','💧'],['پیاده‌روی','🚶']]){
 await page.getByRole('textbox',{name:'نام عادت'}).fill(name);await page.getByRole('button',{name:emoji,exact:true}).click();await page.getByRole('button',{name:'ذخیره',exact:true}).click();await page.getByRole('button',{name:`انجام شد: ${name}`}).click();await page.waitForTimeout(160);
 if(name!=='پیاده‌روی')await page.getByRole('button',{name:'عادت تازه',exact:true}).click();
}
await page.getByRole('button',{name:'تنظیمات',exact:true}).click();await page.waitForTimeout(500);await page.getByRole('button',{name:'روز',exact:true}).click();await page.getByRole('button',{name:'امروز',exact:true}).click();await page.waitForTimeout(700);await page.screenshot({path:'test-artifacts/redesign-today-390.png',fullPage:true});
const homeArchiveButtons=await page.getByRole('button',{name:/بایگانی:/}).count();
await page.getByRole('button',{name:'مسیر من',exact:true}).click();await page.waitForTimeout(700);await page.screenshot({path:'test-artifacts/redesign-journey-390.png',fullPage:true});
const calendarSymbols=await page.locator('.calendar-stamps > span').count();
await page.getByRole('button',{name:'نگاه من',exact:true}).click();await page.waitForTimeout(900);await page.screenshot({path:'test-artifacts/redesign-insights-390.png',fullPage:true});
await page.getByRole('button',{name:'تنظیمات',exact:true}).click();await page.waitForTimeout(700);await page.screenshot({path:'test-artifacts/redesign-profile-390.png',fullPage:true});
await page.getByRole('button',{name:'شب',exact:true}).click();await page.getByRole('button',{name:'امروز',exact:true}).click();await page.waitForTimeout(700);await page.screenshot({path:'test-artifacts/redesign-night-390.png',fullPage:true});
const world=await page.locator('.world-backdrop').boundingBox();
const motion=await page.locator('.cloud-near').evaluate(el=>({duration:getComputedStyle(el).animationDuration,direction:getComputedStyle(el).animationDirection}));
await page.setViewportSize({width:430,height:932});await page.waitForTimeout(200);await page.screenshot({path:'test-artifacts/redesign-night-430.png',fullPage:true});
await page.setViewportSize({width:320,height:690});await page.getByRole('button',{name:'مسیر من',exact:true}).click();await page.waitForTimeout(600);await page.screenshot({path:'test-artifacts/redesign-journey-320.png',fullPage:true});
await page.emulateMedia({reducedMotion:'reduce'});const reducedAnimation=await page.locator('.cloud-near').evaluate(el=>getComputedStyle(el).animationName);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
await writeFile('test-artifacts/redesign-results.json',JSON.stringify({homeArchiveButtons,calendarSymbols,world,motion,overflow,reducedAnimation,errors},null,2));console.log({homeArchiveButtons,calendarSymbols,world,motion,overflow,reducedAnimation,errors});await browser.close();
