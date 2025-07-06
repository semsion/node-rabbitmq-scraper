"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobProducer_1 = require("./producer/jobProducer");
const jobConsumer_1 = require("./consumer/jobConsumer");
const rabbitmqService = __importStar(require("./services/rabbitmq"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Initialize RabbitMQ connection and channels
let jobProducer;
let jobConsumer;
async function initializeRabbitMQ() {
    try {
        const { connection, channel } = await rabbitmqService.connect();
        await rabbitmqService.createQueue(channel, config_1.default.rabbitmq.queue);
        // Remove the await here since createJobProducer is not async
        jobProducer = (0, jobProducer_1.createJobProducer)(channel);
        // Keep the await here since createJobConsumer is async
        jobConsumer = await (0, jobConsumer_1.createJobConsumer)(channel);
        // Start consuming messages
        await jobConsumer.consume(config_1.default.rabbitmq.queue);
        console.log('RabbitMQ initialized successfully');
    }
    catch (error) {
        console.error('Failed to initialize RabbitMQ:', error);
        process.exit(1);
    }
}
app.use(express_1.default.json());
app.post('/jobs', async (req, res) => {
    const { bookingId, urls } = req.body;
    try {
        if (!jobProducer) {
            return res.status(503).send({ error: 'Service unavailable: RabbitMQ not initialized' });
        }
        await jobProducer.sendJob(bookingId, urls);
        res.status(201).send({ message: 'Job created successfully' });
    }
    catch (error) {
        console.error('Error sending job:', error);
        res.status(500).send({ error: 'Failed to create job' });
    }
});
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await initializeRabbitMQ();
});
