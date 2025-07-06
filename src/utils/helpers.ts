export function generateJobId(): string {
  return `job_${Date.now()}`;
}

export function validateUrls(urls: string[]): boolean {
  const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|' + // domain name
    'localhost|' + // localhost
    '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // IP address
    '\\[?[a-fA-F0-9:\\.]+\\])' + // IPv6
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return urls.every(url => urlPattern.test(url));
}