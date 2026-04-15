import { NextResponse } from 'next/server';
import { getJob, updateJob } from '../../../../../src/selfie/job-store';
import { readFile, saveFile, imageFilename } from '../../../../../src/selfie/storage';
import { enhanceFace } from '../../../../../src/selfie/ai-services';
import type { ApiResponse } from '../../../../../src/selfie/types';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { jobId } = await params;
  const job = getJob(jobId);

  if (!job) {
    return NextResponse.json(
      { success: false, error: 'Job not found or has expired' },
      { status: 404 },
    );
  }

  if (job.status === 'processing') {
    return NextResponse.json(
      { success: false, error: 'Job is already processing' },
      { status: 409 },
    );
  }

  updateJob(jobId, { status: 'processing', error: undefined });

  (async () => {
    try {
      const inputBuffer = readFile(job.currentFile);
      const outputBuffer = await enhanceFace(inputBuffer, job.mimeType);

      const filename = imageFilename('result', job.mimeType);
      const resultPath = saveFile(jobId, filename, outputBuffer);

      updateJob(jobId, {
        status: 'completed',
        currentFile: resultPath,
        resultFile: resultPath,
      });
    } catch (err) {
      console.error('[selfie/enhance-face]', err);
      updateJob(jobId, {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Face enhancement failed',
      });
    }
  })();

  return NextResponse.json({ success: true }, { status: 202 });
}
