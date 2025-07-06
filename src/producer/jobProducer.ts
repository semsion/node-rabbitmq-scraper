import { Channel } from 'amqplib';
import { Job, createJob } from '../models/job';

export function createJobProducer(channel: Channel) {
  const sendJob = async (bookingId: string, urls: string[]): Promise<Job> => {
    console.log('🚀 Producer: Preparing to send job...');
    console.log(`📋 Job details: bookingId=${bookingId}, urls=${JSON.stringify(urls)}`);
    
    // Add validation to throw errors as expected by tests
    if (!bookingId) {
      throw new Error('Booking ID is required');
    }
    
    if (!urls || urls.length === 0) {
      throw new Error('At least one URL is required');
    }
    
    // Use createJob function from the imported module
    const job = createJob(bookingId, urls);
    
    console.log('📤 Sending job to queue...');
    await channel.sendToQueue(
      'job_queue', 
      Buffer.from(JSON.stringify(job)),
      { persistent: true }
    );
    
    console.log('✅ Job sent successfully!');
    return job;
  };

  return {
    sendJob
  };
}

export default createJobProducer;