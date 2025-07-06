import { createJobProducer } from '../src/producer/jobProducer';
import * as rabbitmqService from '../src/services/rabbitmq';

describe('JobProducer', () => {
  let jobProducer: ReturnType<typeof createJobProducer>;
  let connection: rabbitmqService.RabbitMQConnection;

  beforeAll(async () => {
    connection = await rabbitmqService.connect();
    jobProducer = createJobProducer(connection.channel);
    await rabbitmqService.createQueue(connection.channel, 'job_queue');
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  test('should create a job and send it to RabbitMQ', async () => {
    const bookingId = '12345';
    const urls = ['http://example.com', 'http://example.org'];

    const result = await jobProducer.sendJob(bookingId, urls);

    expect(result).toBeTruthy();
    expect(result.bookingId).toBe(bookingId);
    expect(result.urls).toEqual(urls);
    expect(result.timestamp).toBeDefined();
  });

  test('should throw an error if booking ID is missing', async () => {
    const urls = ['http://example.com', 'http://example.org'];

    await expect(jobProducer.sendJob('', urls)).rejects.toThrow();
  });

  test('should throw an error if URLs are missing', async () => {
    const bookingId = '12345';

    await expect(jobProducer.sendJob(bookingId, [])).rejects.toThrow();
  });
});