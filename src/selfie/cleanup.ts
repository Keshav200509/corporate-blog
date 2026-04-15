/**
 * Cleanup utility – deletes job directories and store entries for jobs
 * that were created more than SELFIE_CONFIG.cleanupAfterMs ago.
 *
 * Called automatically when the module is first imported (server start-up)
 * and can be triggered again via the /api/selfie/cleanup route.
 */

import { getAllJobs, removeJob } from './job-store';
import { deleteJobDir } from './storage';
import { SELFIE_CONFIG } from './config';

export function cleanupExpiredJobs(): number {
  const cutoff = Date.now() - SELFIE_CONFIG.cleanupAfterMs;
  const expired = getAllJobs().filter((j) => j.createdAt < cutoff);

  for (const job of expired) {
    try {
      deleteJobDir(job.jobId);
    } catch {
      // ignore FS errors
    }
    removeJob(job.jobId);
  }

  if (expired.length > 0) {
    console.info(`[selfie/cleanup] Removed ${expired.length} expired job(s)`);
  }

  return expired.length;
}

// Run once on module load so stale files from a previous server run are pruned
cleanupExpiredJobs();
