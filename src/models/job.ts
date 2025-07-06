export interface Job {
  bookingId: string;
  urls: string[];
  timestamp?: string;
}

export function createJob(bookingId: string, urls: string[]): Job {
  return {
    bookingId,
    urls,
    timestamp: new Date().toISOString()
  };
}

export function jobToJSON(job: Job): { bookingId: string; urls: string[]; timestamp?: string } {
  return {
    bookingId: job.bookingId,
    urls: job.urls,
    timestamp: job.timestamp
  };
}

export default {
  createJob,
  jobToJSON
};