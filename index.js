import puppeteer  from "puppeteer";
import cron from 'node-cron';

const URL = 'https://www.amazon.in/Electric-Instant-Boiling-Overheat-Protection/dp/B0F222W8Q5';
const TARGET_PRICE = 350;

const checkPrice = async () => {
  const browser = await puppeteer.launch({ headless: false }); // ‼️ Amazon Blocks Headless Browsers, try headless "False" if Timeout Error appear.
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  // Take screenshot of the page
  // await page.screenshot({ path: 'amazon.png', fullPage: false });

  // Wait for price element to apear
  await page.waitForSelector('.a-price .a-offscreen', { timeout: 10000 });

  // Extract price
  const price = await page.$eval('.a-price .a-offscreen', el => el.innerText);
  const numericPrice = parseInt(price.replace(/[₹,]/g, ""));

  const title = await page.$eval('#productTitle', el => el.innerText.trim());

  // console.log(`🛒 Product: ${title}`);
  console.log(`Checked: ₹${numericPrice} at ${new Date().toLocaleTimeString()}`);

  if (numericPrice < TARGET_PRICE) {
    console.log('🎉 Price dropped below target!');
  }
  await browser.close();
};

// Schedule every day at 9 AM
cron.schedule('0 9 * * *', checkPrice);

checkPrice(); // run once immediately