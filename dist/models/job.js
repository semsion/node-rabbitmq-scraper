"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobToJSON = exports.createJob = void 0;
function createJob(bookingId, urls) {
    return {
        bookingId,
        urls,
        timestamp: new Date().toISOString()
    };
}
exports.createJob = createJob;
function jobToJSON(job) {
    return {
        bookingId: job.bookingId,
        urls: job.urls,
        timestamp: job.timestamp
    };
}
exports.jobToJSON = jobToJSON;
exports.default = {
    createJob,
    jobToJSON
};
