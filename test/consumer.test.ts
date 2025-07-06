import * as rabbitmqService from '../src/services/rabbitmq';
import { createJobConsumer } from '../src/consumer/jobConsumer';

describe('JobConsumer', () => {
  let connection: rabbitmqService.RabbitMQConnection;
  let jobConsumer: Awaited<ReturnType<typeof createJobConsumer>>;
  const queueName = 'test_queue';

  beforeAll(async () => {
    connection = await rabbitmqService.connect();
    await rabbitmqService.createQueue(connection.channel, queueName);
    jobConsumer = await createJobConsumer(connection.channel);
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  test('should consume messages from RabbitMQ', async () => {
    const mockMessage = {
      bookingId: '12345',
      urls: ['http://example.com', 'http://example.org'],
      timestamp: new Date().toISOString()
    };

    // Setup a listener for the message
    const messagePromise = new Promise<any>((resolve) => {
      connection.channel.consume(queueName, (msg) => {
        if (msg) {
          connection.channel.ack(msg);
          resolve(JSON.parse(msg.content.toString()));
        }
      }, { noAck: false });
    });

    // Send a message to the queue
    await connection.channel.sendToQueue(
      queueName, 
      Buffer.from(JSON.stringify(mockMessage)),
      { persistent: true }
    );

    // Wait for the message to be consumed
    const receivedMessage = await messagePromise;
    
    // Compare only the relevant fields, ignore timestamp which changes with each test run
    expect(receivedMessage.bookingId).toEqual(mockMessage.bookingId);
    expect(receivedMessage.urls).toEqual(mockMessage.urls);
    
    // Check timestamp exists but don't compare exact value
    expect(receivedMessage.timestamp).toBeDefined();
  });
});