import { NextResponse } from 'next/server';
import { cleanupExpiredJobs } from '../../../../src/selfie/cleanup';

export const dynamic = 'force-dynamic';

/** Trigger manual cleanup – useful for cron jobs or health checks. */
export async function POST(): Promise<NextResponse> {
  const removed = cleanupExpiredJobs();
  return NextResponse.json({ success: true, data: { removedJobs: removed } });
}
