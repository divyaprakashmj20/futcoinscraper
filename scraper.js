const { chromium } = require("playwright");
const { getFirebase } = require("./firebase");

const URL = "https://futcoin.net/en/fc-26-coins/ps5/comfort";
const COINS = "2000000";

(async () => {
    const browser = await chromium.launch({ headless: true }); // false so you SEE it
    const page = await browser.newPage();

    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await page.locator("text=USD").nth(0).click();
    await page.locator("text=EUR").nth(1).click();
    await page.waitForTimeout(2000);

    const coinsInput = page.locator("input").first();
    coinsInput.clear();
    await coinsInput.fill(COINS);

    await page.waitForTimeout(2000);
    const pageText = await page.innerText("body");

    amount = await page
        .getByText("Amount", { exact: true })
        .locator("xpath=following::div[contains(text(),'€')]")
        .first()
        .innerText();
    amount = amount.replace('€', '')
    console.log("Amount:", amount);


    await browser.close();

    const { db, admin } = getFirebase();
    await db.ref("futcoin_prices").push({
        coins: Number(COINS),
        amount,
        currency: "EUR",
        url: URL,
        scrapedAt: new Date().toISOString(),
    });

    await admin.app().delete();

    process.exit(0);
})();
