// This file initializes the job producer for sending jobs to RabbitMQ.

import { createJobProducer } from './jobProducer';
import * as rabbitmqService from '../services/rabbitmq';

interface JobData {
  bookingId: string;
  urls: string[];
}

async function startProducer(): Promise<void> {
  try {
    const { channel } = await rabbitmqService.connect();
    // Change from 'new JobProducer(channel)' to 'createJobProducer(channel)'
    const producer = createJobProducer(channel);
    console.log('Producer connected to RabbitMQ');

    // Example job data
    const jobData: JobData = {
      bookingId: '12345',
      urls: [
        'http://example.com/crm1',
        'http://example.com/crm2',
        'http://example.com/crm3'
      ]
    };

    await producer.sendJob(jobData.bookingId, jobData.urls);
    console.log('Job sent:', jobData);
  } catch (error) {
    console.error('Error starting producer:', error);
  }
}

startProducer();