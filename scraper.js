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
    const now = new Date();

    const dateKey = now.toISOString().slice(0, 10);

    // Time: HH-mm-ss
    const timeKey = now.toISOString().slice(11, 19).replace(/:/g, "-");
    await db
        .ref("futcoin_prices")
        .child(dateKey)
        .child(timeKey)
        .set(amount);


    const lowRef = db.ref("meta/all_time_low");
    const result = await lowRef.transaction((currentLow) => {
        if (currentLow === null || amount < currentLow) {
            return amount;
        }
        return;
    });

    if (result.committed) {
        console.log("New all-time low set:", amount);
    } else {
        console.log("No new low. Current price:", amount);
    }

    await admin.app().delete();

    process.exit(0);
})();
