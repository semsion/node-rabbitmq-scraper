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
const jobConsumer_1 = require("./jobConsumer");
const rabbitmqService = __importStar(require("../services/rabbitmq"));
const config_1 = __importDefault(require("../config"));
const startConsumer = async () => {
    try {
        const { channel } = await rabbitmqService.connect();
        await rabbitmqService.createQueue(channel, config_1.default.rabbitmq.queue);
        // Add await here since createJobConsumer returns a Promise
        const consumer = await (0, jobConsumer_1.createJobConsumer)(channel);
        await consumer.consume(config_1.default.rabbitmq.queue);
        console.log('Consumer started successfully');
    }
    catch (err) {
        console.error('Error starting consumer:', err);
        process.exit(1);
    }
};
startConsumer();
