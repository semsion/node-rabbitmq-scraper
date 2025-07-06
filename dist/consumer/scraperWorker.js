"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// filepath: /home/ioi/Documents/Bookable/node-rabbitmq-scraper/src/consumer/scraperWorker.ts
const puppeteer_1 = __importDefault(require("puppeteer"));
const logger_1 = __importDefault(require("../utils/logger"));
async function scrapeUrls(urls) {
    const browser = await puppeteer_1.default.launch();
    const results = [];
    for (const url of urls) {
        try {
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });
            const data = await page.evaluate(() => {
                // Implement scraping logic here
                return document.body.innerText; // Example: return the text content of the page
            });
            results.push({ url, data });
            await page.close();
        }
        catch (error) {
            logger_1.default.error(`Error scraping ${url}: ${error.message}`);
            results.push({ url, error: error.message });
        }
    }
    await browser.close();
    return results;
}
exports.default = scrapeUrls;
