import { NextResponse } from 'next/server';
import { getJob, updateJob } from '../../../../../src/selfie/job-store';
import { readFile, saveFile, imageFilename } from '../../../../../src/selfie/storage';
import { applyStyle } from '../../../../../src/selfie/ai-services';
import { STYLE_PRESETS } from '../../../../../src/selfie/config';
import type { ApiResponse, StylePreset } from '../../../../../src/selfie/types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
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

  let styleId: StylePreset = 'professional';
  let customPrompt: string | undefined;

  try {
    const body = await request.json() as { style?: StylePreset; prompt?: string };
    if (body.style) styleId = body.style;
    if (body.prompt) customPrompt = body.prompt;
  } catch {
    // no body – use defaults
  }

  const preset = STYLE_PRESETS.find((p) => p.id === styleId);
  const prompt = customPrompt ?? preset?.prompt ?? styleId;

  updateJob(jobId, { status: 'processing', error: undefined });

  (async () => {
    try {
      const inputBuffer = readFile(job.currentFile);
      const outputBuffer = await applyStyle(inputBuffer, job.mimeType, prompt);

      const filename = imageFilename('result', job.mimeType);
      const resultPath = saveFile(jobId, filename, outputBuffer);

      updateJob(jobId, {
        status: 'completed',
        currentFile: resultPath,
        resultFile: resultPath,
      });
    } catch (err) {
      console.error('[selfie/apply-style]', err);
      updateJob(jobId, {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Style transfer failed',
      });
    }
  })();

  return NextResponse.json({ success: true }, { status: 202 });
}
