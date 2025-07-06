"use strict";
// This file initializes the job producer for sending jobs to RabbitMQ.
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
Object.defineProperty(exports, "__esModule", { value: true });
const jobProducer_1 = require("./jobProducer");
const rabbitmqService = __importStar(require("../services/rabbitmq"));
async function startProducer() {
    try {
        const { channel } = await rabbitmqService.connect();
        // Change from 'new JobProducer(channel)' to 'createJobProducer(channel)'
        const producer = (0, jobProducer_1.createJobProducer)(channel);
        console.log('Producer connected to RabbitMQ');
        // Example job data
        const jobData = {
            bookingId: '12345',
            urls: [
                'http://example.com/crm1',
                'http://example.com/crm2',
                'http://example.com/crm3'
            ]
        };
        await producer.sendJob(jobData.bookingId, jobData.urls);
        console.log('Job sent:', jobData);
    }
    catch (error) {
        console.error('Error starting producer:', error);
    }
}
startProducer();
