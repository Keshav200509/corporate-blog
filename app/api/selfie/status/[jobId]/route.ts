import { NextResponse } from 'next/server';
import { getJob } from '../../../../../src/selfie/job-store';
import type { ApiResponse, StatusResult } from '../../../../../src/selfie/types';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> },
): Promise<NextResponse<ApiResponse<StatusResult>>> {
  const { jobId } = await params;
  const job = getJob(jobId);

  if (!job) {
    return NextResponse.json(
      { success: false, error: 'Job not found or has expired' },
      { status: 404 },
    );
  }

  const resultUrl =
    job.status === 'completed' ? `/api/selfie/result/${jobId}` : undefined;

  return NextResponse.json({
    success: true,
    data: {
      jobId: job.jobId,
      status: job.status,
      resultUrl,
      error: job.error,
    },
  });
}
