import amqp, { Connection, Channel } from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

export interface RabbitMQConnection {
  connection: Connection;
  channel: Channel;
}

export async function connect(): Promise<RabbitMQConnection> {
  try {
    console.log('🔌 Connecting to RabbitMQ at:', RABBITMQ_URL);
    const connection = await amqp.connect(RABBITMQ_URL);
    console.log('🔗 Connection established successfully');
    
    const channel = await connection.createChannel();
    console.log('📢 Channel created successfully');
    
    return { connection, channel };
  } catch (error) {
    console.error('❌ Error connecting to RabbitMQ:', error);
    throw error;
  }
}

export async function createQueue(channel: Channel, queueName: string): Promise<void> {
  try {
    console.log(`📦 Creating/verifying queue "${queueName}"...`);
    await channel.assertQueue(queueName, { durable: true });
    console.log(`✅ Queue "${queueName}" is ready`);
  } catch (error) {
    console.error(`❌ Error creating queue ${queueName}:`, error);
    throw error;
  }
}