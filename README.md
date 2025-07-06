# Node RabbitMQ Scraper

A Node.js application built with TypeScript that uses RabbitMQ for asynchronous job processing and Puppeteer for web scraping.

## Overview

This application provides a robust infrastructure for scheduling and processing web scraping jobs asynchronously. It uses a producer-consumer pattern with RabbitMQ as the message broker:

1. **Producer**: Accepts scraping jobs via an HTTP API and enqueues them in RabbitMQ.
2. **Consumer**: Consumes jobs from the queue and processes them with Puppeteer.
3. **Scraper**: Extracts data from web pages including titles, meta descriptions, and links.

## Architecture

The application follows a functional programming approach with TypeScript for type safety:

- **Express API**: Accepts job requests and forwards them to the producer.
- **RabbitMQ**: Manages the job queue for reliable delivery.
- **Puppeteer**: Headless browser for web scraping.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- RabbitMQ Server

### RabbitMQ Installation

Install and set up RabbitMQ on Ubuntu:

```bash
# Install RabbitMQ
sudo apt install rabbitmq-server

# Start RabbitMQ service
sudo systemctl start rabbitmq-server

# Enable RabbitMQ to start on boot
sudo systemctl enable rabbitmq-server

# Verify RabbitMQ is running
sudo systemctl status rabbitmq-server
```

### Application Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/semsion/node-rabbitmq-scraper.git
   cd node-rabbitmq-scraper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

## Running the Application

### Build the TypeScript Code

```bash
npm run build
```

### Start the Application

```bash
npm start
```

For development with automatic reloading:
```bash
npm run dev
```

## Usage

### Sending Scraping Jobs

Use the REST API to send a scraping job:

```bash
curl -X POST http://localhost:3000/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "123456",
    "urls": [
      "https://www.example.com",
      "https://developer.mozilla.org",
      "https://github.com"
    ]
  }'
```

### Monitoring

Check the console output for detailed logs of the scraping process. RabbitMQ provides various monitoring tools:

```bash
# Enable RabbitMQ management interface
sudo rabbitmq-plugins enable rabbitmq_management

# Access the management interface at http://localhost:15672
# Default credentials: guest/guest
```

## Project Structure

```
node-rabbitmq-scraper
├── src/
│   ├── app.ts                 # Main application entry point
│   ├── config/                # Configuration files
│   ├── consumer/              # Message queue consumer
│   ├── models/                # Data models
│   ├── producer/              # Message queue producer
│   ├── services/              # Core services (RabbitMQ, scraper)
│   └── utils/                 # Utility functions
├── test/                      # Test files
├── package.json               # Node.js dependencies
└── tsconfig.json              # TypeScript configuration
```

## Customizing Scraping Logic

The main scraping logic is defined in:

1. jobConsumer.ts - Contains the core scraping functionality using Puppeteer
2. scraper.ts - Provides a simpler implementation for scraping

To customize what gets scraped, modify the page evaluation functions in these files. For example, in jobConsumer.ts, you can enhance the page evaluation function to extract specific elements:

```typescript
// Example: Extract product information from an e-commerce site
const productData = await page.evaluate(() => {
  return {
    title: document.querySelector('.product-title')?.textContent?.trim(),
    price: document.querySelector('.product-price')?.textContent?.trim(),
    description: document.querySelector('.product-description')?.textContent?.trim(),
    imageUrl: document.querySelector('.product-image')?.getAttribute('src')
  };
});
```

## Key Features

- **Functional Programming**: Uses a functional approach with TypeScript for better testability
- **Asynchronous Processing**: Non-blocking job processing with RabbitMQ
- **Error Handling**: Robust error handling with message acknowledgment
- **Scalability**: Can be scaled horizontally by running multiple consumers, via tools like PM2, Docker, or Kubernetes.
- **Configurability**: Uses configuration values from index.ts

## Testing

Run the test suite with:

```bash
npm test
```

## License

MIT