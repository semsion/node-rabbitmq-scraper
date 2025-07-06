import puppeteer from 'puppeteer';
import * as scraper from '../src/services/scraper';

describe('Scraper Functionality', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('should scrape data from a given URL', async () => {
        const url = 'https://example.com'; // Replace with a valid URL for testing
        const expectedData = 'Example Domain'; // Replace with expected data from the URL

        const results = await scraper.scrapeUrls([url]);
        expect(results[0].data.content).toContain(expectedData);
    });

    test('should handle invalid URLs gracefully', async () => {
        // Use a clearly invalid URL format that will definitely fail
        const invalidUrl = 'https://this-domain-definitely-does-not-exist-123456789.com';

        await expect(scraper.scrapeUrls([invalidUrl])).rejects.toThrow();
    });
});