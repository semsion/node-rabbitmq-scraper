import dotenv from 'dotenv';

dotenv.config();

interface RabbitMQConfig {
  url: string;
  queue: string;
}

interface PuppeteerConfig {
  headless: boolean;
}

interface Config {
  rabbitmq: RabbitMQConfig;
  puppeteer: PuppeteerConfig;
}

const config: Config = {
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    queue: process.env.RABBITMQ_QUEUE || 'job_queue',
  },
  puppeteer: {
    headless: process.env.PUPPETEER_HEADLESS === 'true',
  },
};

export default config;