"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobConsumer = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
// Define the scrapeUrls function
async function scrapeUrls(bookingId, urls) {
    console.log(`🔎 Starting scraping for booking ${bookingId} with ${urls.length} URLs`);
    const results = [];
    const browser = await puppeteer_1.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        for (const url of urls) {
            console.log(`🌐 Scraping URL: ${url}`);
            const page = await browser.newPage();
            try {
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
                // Extract page title
                const title = await page.title();
                // Extract meta description
                const description = await page.evaluate(() => {
                    const metaDescription = document.querySelector('meta[name="description"]');
                    return metaDescription ? metaDescription.getAttribute('content') : '';
                });
                // Example: extract all links
                const links = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('a')).map(a => ({
                        href: a.href,
                        text: a.innerText.trim()
                    }));
                });
                results.push({
                    url,
                    title,
                    description: description || undefined,
                    linksCount: links.length,
                    timestamp: new Date().toISOString()
                });
                console.log(`✅ Successfully scraped: ${url}`);
            }
            catch (error) {
                console.error(`❌ Error scraping ${url}:`, error.message);
                results.push({
                    url,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
            finally {
                await page.close();
            }
        }
    }
    finally {
        await browser.close();
    }
    console.log(`🏁 Completed scraping for booking ${bookingId}`);
    return results;
}
async function createJobConsumer(channel) {
    const consume = async (queueName) => {
        console.log(`🔍 Consumer: Starting to listen on queue "${queueName}"...`);
        await channel.consume(queueName, async (msg) => {
            if (msg) {
                console.log('📩 Received message from queue');
                try {
                    const content = JSON.parse(msg.content.toString());
                    console.log('📄 Message content:', JSON.stringify(content, null, 2));
                    console.log('⏳ Processing job...');
                    const results = await scrapeUrls(content.bookingId, content.urls);
                    console.log('📊 Scraping results:', JSON.stringify(results, null, 2));
                    console.log(`✅ Job processed successfully for bookingId: ${content.bookingId}`);
                    channel.ack(msg);
                }
                catch (error) {
                    console.error('❌ Error processing message:', error);
                    // Negative acknowledge the message
                    channel.nack(msg, false, true);
                }
            }
        });
        console.log('🎧 Consumer is now listening for messages');
    };
    return {
        consume
    };
}
exports.createJobConsumer = createJobConsumer;
exports.default = createJobConsumer;
