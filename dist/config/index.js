"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://localhost',
        queue: process.env.RABBITMQ_QUEUE || 'job_queue',
    },
    puppeteer: {
        headless: process.env.PUPPETEER_HEADLESS === 'true',
    },
};
exports.default = config;
