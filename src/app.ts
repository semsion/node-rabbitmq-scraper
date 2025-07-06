import express, { Request, Response } from 'express';
import { createJobProducer } from './producer/jobProducer';
import { createJobConsumer } from './consumer/jobConsumer';
import * as rabbitmqService from './services/rabbitmq';
import config from './config';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize RabbitMQ connection and channels
let jobProducer: { sendJob: (bookingId: string, urls: string[]) => Promise<any> } | undefined;
let jobConsumer: { consume: (queueName: string) => Promise<void> } | undefined;

interface JobRequest {
  bookingId: string;
  urls: string[];
}

async function initializeRabbitMQ(): Promise<void> {
  try {
    const { connection, channel } = await rabbitmqService.connect();
    await rabbitmqService.createQueue(channel, config.rabbitmq.queue);
    
    // Remove the await here since createJobProducer is not async
    jobProducer = createJobProducer(channel);
    // Keep the await here since createJobConsumer is async
    jobConsumer = await createJobConsumer(channel);
    
    // Start consuming messages
    await jobConsumer.consume(config.rabbitmq.queue);
    console.log('RabbitMQ initialized successfully');
  } catch (error) {
    console.error('Failed to initialize RabbitMQ:', error);
    process.exit(1);
  }
}

app.use(express.json());

app.post('/jobs', async (req: Request, res: Response) => {
  const { bookingId, urls } = req.body as JobRequest;
  try {
    if (!jobProducer) {
      return res.status(503).send({ error: 'Service unavailable: RabbitMQ not initialized' });
    }
    await jobProducer.sendJob(bookingId, urls);
    res.status(201).send({ message: 'Job created successfully' });
  } catch (error) {
    console.error('Error sending job:', error);
    res.status(500).send({ error: 'Failed to create job' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeRabbitMQ();
});