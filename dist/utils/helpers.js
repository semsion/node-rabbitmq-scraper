"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUrls = exports.generateJobId = void 0;
function generateJobId() {
    return `job_${Date.now()}`;
}
exports.generateJobId = generateJobId;
function validateUrls(urls) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|' + // domain name
        'localhost|' + // localhost
        '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // IP address
        '\\[?[a-fA-F0-9:\\.]+\\])' + // IPv6
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return urls.every(url => urlPattern.test(url));
}
exports.validateUrls = validateUrls;
