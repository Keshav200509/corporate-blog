/**
 * In-memory job store with JSON file persistence.
 *
 * Works well for single-process self-hosted deployments (VPS / Docker).
 * For multi-process / serverless deployments swap this module for a
 * Redis-backed implementation (e.g. BullMQ) without touching API routes.
 */

import fs from 'fs';
import path from 'path';
import type { SelfieJob } from './types';
import { SELFIE_CONFIG } from './config';

const store = new Map<string, SelfieJob>();
const persistFile = path.join(SELFIE_CONFIG.tempDir, '_jobs.json');

function ensureDir() {
  fs.mkdirSync(SELFIE_CONFIG.tempDir, { recursive: true });
}

function persist() {
  try {
    ensureDir();
    fs.writeFileSync(persistFile, JSON.stringify(Object.fromEntries(store), null, 2));
  } catch {
    // best-effort
  }
}

// Hydrate from disk on module init so jobs survive hot-reloads
try {
  ensureDir();
  if (fs.existsSync(persistFile)) {
    const raw = JSON.parse(fs.readFileSync(persistFile, 'utf-8')) as Record<string, SelfieJob>;
    for (const [k, v] of Object.entries(raw)) {
      store.set(k, v);
    }
  }
} catch {
  // start fresh
}

export function getJob(jobId: string): SelfieJob | undefined {
  return store.get(jobId);
}

export function createJob(job: SelfieJob): void {
  store.set(job.jobId, job);
  persist();
}

export function updateJob(jobId: string, updates: Partial<SelfieJob>): void {
  const existing = store.get(jobId);
  if (!existing) return;
  store.set(jobId, { ...existing, ...updates, updatedAt: Date.now() });
  persist();
}

export function removeJob(jobId: string): void {
  store.delete(jobId);
  persist();
}

export function getAllJobs(): SelfieJob[] {
  return Array.from(store.values());
}
