async function test () {
  const puppeteer = require('puppeteer');

  let browser, page;
  let url = "https://google.com";

  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();

  await page.goto(url);
  const title = await page.title();
  console.log(title);

  browser.close();
}

test();
