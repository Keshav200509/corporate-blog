import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createJob } from '../../../../src/selfie/job-store';
import { saveFile, imageFilename } from '../../../../src/selfie/storage';
import { SELFIE_CONFIG } from '../../../../src/selfie/config';
import { cleanupExpiredJobs } from '../../../../src/selfie/cleanup';
import type { ApiResponse, UploadResult } from '../../../../src/selfie/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<NextResponse<ApiResponse<UploadResult>>> {
  // Prune stale jobs on every upload (lightweight housekeeping)
  cleanupExpiredJobs();

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('image') as File | null;

  if (!file || typeof file === 'string') {
    return NextResponse.json(
      { success: false, error: 'No image field found in the request' },
      { status: 400 },
    );
  }

  const mimeType = file.type as string;
  if (!SELFIE_CONFIG.allowedMimeTypes.includes(mimeType as 'image/jpeg' | 'image/png' | 'image/webp')) {
    return NextResponse.json(
      { success: false, error: 'Unsupported file type. Please upload a JPG, PNG or WebP image.' },
      { status: 415 },
    );
  }

  if (file.size > SELFIE_CONFIG.maxFileSizeBytes) {
    return NextResponse.json(
      {
        success: false,
        error: `File too large. Maximum allowed size is ${SELFIE_CONFIG.maxFileSizeMB} MB.`,
      },
      { status: 413 },
    );
  }

  try {
    const jobId = randomUUID();
    const filename = imageFilename('original', file.type);
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = saveFile(jobId, filename, buffer);
    const now = Date.now();

    createJob({
      jobId,
      status: 'pending',
      originalFile: filePath,
      currentFile: filePath,
      mimeType: file.type,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ success: true, data: { jobId } }, { status: 201 });
  } catch (err) {
    console.error('[selfie/upload]', err);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
