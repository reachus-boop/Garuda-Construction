const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  // 1. packages.html - 4 compact cards & comparison
  await page.goto('http://localhost:3030/packages', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(__dirname, '..', 'packages_mobile_verified.png'), fullPage: false });
  
  // Scroll down to the bnb comparison cards
  const bnbSection = await page.$('#bnb-compare-section');
  if (bnbSection) {
    await bnbSection.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, '..', 'packages_bnb_verified.png'), fullPage: false });
  }

  // 2. calculator.html - 4 compact cards
  await page.goto('http://localhost:3030/calculator', { waitUntil: 'networkidle0' });
  const calcCards = await page.$('#packages-cards');
  if (calcCards) {
    await calcCards.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, '..', 'calculator_mobile_verified.png'), fullPage: false });
  }

  await browser.close();
  console.log('Screenshots captured successfully.');
})();
