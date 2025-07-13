import puppeteer from 'puppeteer';
import { Channel, ConsumeMessage } from 'amqplib';
import { Job } from '../models/job'; // Import Job interface

interface ScrapingResult {
  url: string;
  title?: string;
  description?: string;
  linksCount?: number;
  error?: string;
  timestamp: string;
}

// Define the scrapeUrls function
async function scrapeUrls(bookingId: string, urls: string[]): Promise<ScrapingResult[]> {
  console.log(`🔎 Starting scraping for booking ${bookingId} with ${urls.length} URLs`);
  const results: ScrapingResult[] = [];
  
  const browser = await puppeteer.launch({
    headless: true,

    // TODO: This may need to be adjusted based on your environment, and for compliance with security policies
    // Use the following args to reduce detection and improve performance
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-http2' // Disable HTTP/2 protocol
    ],
    ignoreHTTPSErrors: true
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
      } catch (error) {
        console.error(`❌ Error scraping ${url}:`, (error as Error).message);
        results.push({
          url,
          error: (error as Error).message,
          timestamp: new Date().toISOString()
        });
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  
  console.log(`🏁 Completed scraping for booking ${bookingId}`);
  return results;
}

export async function createJobConsumer(channel: Channel) {
  const consume = async (queueName: string): Promise<void> => {
    console.log(`🔍 Consumer: Starting to listen on queue "${queueName}"...`);
    
    await channel.consume(queueName, async (msg: ConsumeMessage | null) => {
      if (msg) {
        console.log('📩 Received message from queue');
        
        try {
          const content = JSON.parse(msg.content.toString()) as Job;
          console.log('📄 Message content:', JSON.stringify(content, null, 2));
          
          console.log('⏳ Processing job...');
          const results = await scrapeUrls(content.bookingId, content.urls);
          console.log('📊 Scraping results:', JSON.stringify(results, null, 2));
          
          console.log(`✅ Job processed successfully for bookingId: ${content.bookingId}`);
          channel.ack(msg);
        } catch (error) {
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

export default createJobConsumer;