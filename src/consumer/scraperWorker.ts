// filepath: /home/ioi/Documents/Bookable/node-rabbitmq-scraper/src/consumer/scraperWorker.ts
import puppeteer from 'puppeteer';
import logger from '../utils/logger';

interface ScrapingResult {
  url: string;
  data?: string;
  error?: string;
}

async function scrapeUrls(urls: string[]): Promise<ScrapingResult[]> {
  const browser = await puppeteer.launch();
  const results: ScrapingResult[] = [];

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
    } catch (error) {
      logger.error(`Error scraping ${url}: ${(error as Error).message}`);
      results.push({ url, error: (error as Error).message });
    }
  }

  await browser.close();
  return results;
}

export default scrapeUrls;