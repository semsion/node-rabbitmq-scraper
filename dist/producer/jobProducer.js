"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobProducer = void 0;
const job_1 = require("../models/job");
function createJobProducer(channel) {
    const sendJob = async (bookingId, urls) => {
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
        const job = (0, job_1.createJob)(bookingId, urls);
        console.log('📤 Sending job to queue...');
        await channel.sendToQueue('job_queue', Buffer.from(JSON.stringify(job)), { persistent: true });
        console.log('✅ Job sent successfully!');
        return job;
    };
    return {
        sendJob
    };
}
exports.createJobProducer = createJobProducer;
exports.default = createJobProducer;
