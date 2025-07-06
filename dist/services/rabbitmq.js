"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueue = exports.connect = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
async function connect() {
    try {
        console.log('🔌 Connecting to RabbitMQ at:', RABBITMQ_URL);
        const connection = await amqplib_1.default.connect(RABBITMQ_URL);
        console.log('🔗 Connection established successfully');
        const channel = await connection.createChannel();
        console.log('📢 Channel created successfully');
        return { connection, channel };
    }
    catch (error) {
        console.error('❌ Error connecting to RabbitMQ:', error);
        throw error;
    }
}
exports.connect = connect;
async function createQueue(channel, queueName) {
    try {
        console.log(`📦 Creating/verifying queue "${queueName}"...`);
        await channel.assertQueue(queueName, { durable: true });
        console.log(`✅ Queue "${queueName}" is ready`);
    }
    catch (error) {
        console.error(`❌ Error creating queue ${queueName}:`, error);
        throw error;
    }
}
exports.createQueue = createQueue;
