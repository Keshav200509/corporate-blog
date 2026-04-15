import fs from 'fs';
import path from 'path';
import { SELFIE_CONFIG } from './config';

export function getJobDir(jobId: string): string {
  return path.join(SELFIE_CONFIG.tempDir, jobId);
}

export function ensureJobDir(jobId: string): string {
  const dir = getJobDir(jobId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function saveFile(jobId: string, name: string, buffer: Buffer): string {
  const dir = ensureJobDir(jobId);
  const filePath = path.join(dir, name);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

export function readFile(filePath: string): Buffer {
  return fs.readFileSync(filePath);
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function deleteJobDir(jobId: string): void {
  const dir = getJobDir(jobId);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/** Derive a safe filename for an uploaded image given a MIME type. */
export function imageFilename(base: string, mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  return base + (mimeToExt[mimeType] ?? '.jpg');
}
