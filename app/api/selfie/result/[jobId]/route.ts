import { getJob } from '../../../../../src/selfie/job-store';
import { readFile, fileExists } from '../../../../../src/selfie/storage';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> },
): Promise<Response> {
  const { jobId } = await params;
  const job = getJob(jobId);

  if (!job) {
    return new Response(JSON.stringify({ error: 'Job not found or has expired' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (job.status !== 'completed') {
    return new Response(
      JSON.stringify({ error: 'Result not ready yet', status: job.status }),
      { status: 202, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const filePath = job.resultFile ?? job.currentFile;

  if (!fileExists(filePath)) {
    return new Response(JSON.stringify({ error: 'Result file has expired or been removed' }), {
      status: 410,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const buffer = readFile(filePath);
  const ext = filePath.split('.').pop() ?? 'jpg';
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  };
  const contentType = mimeMap[ext] ?? job.mimeType ?? 'application/octet-stream';

  return new Response(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="selfie-result-${jobId.slice(0, 8)}.${ext}"`,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
