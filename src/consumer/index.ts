import { createJobConsumer } from './jobConsumer';
import * as rabbitmqService from '../services/rabbitmq';
import config from '../config';

const startConsumer = async (): Promise<void> => {
  try {
    const { channel } = await rabbitmqService.connect();
    await rabbitmqService.createQueue(channel, config.rabbitmq.queue);
    
    // Add await here since createJobConsumer returns a Promise
    const consumer = await createJobConsumer(channel);
    await consumer.consume(config.rabbitmq.queue);
    console.log('Consumer started successfully');
  } catch (err) {
    console.error('Error starting consumer:', err);
    process.exit(1);
  }
};

startConsumer();