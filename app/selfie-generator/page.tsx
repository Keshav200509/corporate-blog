'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { StylePreset } from '../../src/selfie/types';
import { STYLE_PRESETS } from '../../src/selfie/config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UIStatus = 'idle' | 'uploading' | 'pending' | 'processing' | 'completed' | 'failed';

interface JobState {
  jobId: string | null;
  status: UIStatus;
  resultUrl: string | null;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto mb-4 text-indigo-400"
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function SelfieGeneratorPage() {
  const [job, setJob] = useState<JobState>({
    jobId: null,
    status: 'idle',
    resultUrl: null,
    error: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>('professional');
  const [isDragging, setIsDragging] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPreviewRef = useRef<string | null>(null);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Polling
  // ---------------------------------------------------------------------------

  const startPolling = useCallback(
    (jobId: string) => {
      const poll = async () => {
        try {
          const res = await fetch(`/api/selfie/status/${jobId}`);
          const json = await res.json() as {
            success: boolean;
            data?: { status: string; resultUrl?: string; error?: string };
          };

          if (!json.success || !json.data) {
            setJob((prev) => ({ ...prev, status: 'failed', error: 'Status check failed' }));
            return;
          }

          const { status, resultUrl, error } = json.data;

          if (status === 'completed') {
            // Cache-bust so the browser fetches the fresh result
            const url = `${resultUrl}?t=${Date.now()}`;
            setJob((prev) => ({ ...prev, status: 'completed', resultUrl: url, error: null }));
            setActiveAction(null);
          } else if (status === 'failed') {
            setJob((prev) => ({ ...prev, status: 'failed', error: error ?? 'Processing failed' }));
            setActiveAction(null);
          } else {
            // Still pending / processing – poll again
            pollRef.current = setTimeout(poll, 2000);
          }
        } catch {
          pollRef.current = setTimeout(poll, 3000);
        }
      };

      // Clear any existing poll
      if (pollRef.current) clearTimeout(pollRef.current);
      pollRef.current = setTimeout(poll, 1500);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // File handling
  // ---------------------------------------------------------------------------

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setJob((prev) => ({
          ...prev,
          status: 'failed',
          error: 'Please upload an image file (JPG, PNG, or WebP).',
        }));
        return;
      }

      // Show local preview immediately
      if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current);
      const blobUrl = URL.createObjectURL(file);
      prevPreviewRef.current = blobUrl;
      setPreviewUrl(blobUrl);
      setJob({ jobId: null, status: 'uploading', resultUrl: null, error: null });

      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('/api/selfie/upload', { method: 'POST', body: formData });
        const json = await res.json() as { success: boolean; data?: { jobId: string }; error?: string };

        if (!json.success || !json.data) {
          setJob({ jobId: null, status: 'failed', resultUrl: null, error: json.error ?? 'Upload failed' });
          return;
        }

        const { jobId } = json.data;
        setJob({ jobId, status: 'pending', resultUrl: null, error: null });
      } catch {
        setJob({ jobId: null, status: 'failed', resultUrl: null, error: 'Network error during upload' });
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Drag-and-drop
  // ---------------------------------------------------------------------------

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // ---------------------------------------------------------------------------
  // AI actions
  // ---------------------------------------------------------------------------

  const triggerAction = useCallback(
    async (endpoint: string, label: string, body?: object) => {
      if (!job.jobId) return;
      setActiveAction(label);
      setJob((prev) => ({ ...prev, status: 'processing', error: null }));

      try {
        const res = await fetch(`/api/selfie/${endpoint}/${job.jobId}`, {
          method: 'POST',
          headers: body ? { 'Content-Type': 'application/json' } : undefined,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
          const json = await res.json() as { error?: string };
          throw new Error(json.error ?? `${label} failed`);
        }

        startPolling(job.jobId);
      } catch (err) {
        setJob((prev) => ({
          ...prev,
          status: 'failed',
          error: err instanceof Error ? err.message : `${label} failed`,
        }));
        setActiveAction(null);
      }
    },
    [job.jobId, startPolling],
  );

  const handleRemoveBg = () => triggerAction('remove-bg', 'Remove Background');
  const handleApplyStyle = () =>
    triggerAction('apply-style', 'Apply Style', { style: selectedStyle });
  const handleEnhanceFace = () => triggerAction('enhance-face', 'Enhance Face');

  // ---------------------------------------------------------------------------
  // Download
  // ---------------------------------------------------------------------------

  const handleDownload = useCallback(async () => {
    if (!job.resultUrl) return;
    try {
      const res = await fetch(job.resultUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-selfie-${job.jobId?.slice(0, 8) ?? 'result'}.${blob.type.includes('png') ? 'png' : 'jpg'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(job.resultUrl, '_blank');
    }
  }, [job.resultUrl, job.jobId]);

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const handleReset = useCallback(() => {
    if (pollRef.current) clearTimeout(pollRef.current);
    setJob({ jobId: null, status: 'idle', resultUrl: null, error: null });
    setPreviewUrl(null);
    setActiveAction(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const isProcessing = job.status === 'uploading' || job.status === 'processing';
  const hasJob = !!job.jobId;
  const showEditor = hasJob || previewUrl !== null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Hero */}
      <section className="border-b border-zinc-200/60 bg-white/70 px-6 py-10 text-center backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto max-w-2xl">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
            Open-source AI • No account required
          </span>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            AI Selfie Generator
          </h1>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            Upload your photo and transform it with AI&mdash;remove backgrounds, apply artistic
            styles, and enhance facial details. Powered by rembg, Stable Diffusion &amp; GFPGAN.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* ---------------------------------------------------------------- */}
        {/* Upload area (shown when no job / reset)                          */}
        {/* ---------------------------------------------------------------- */}
        {!showEditor && (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative mx-auto flex max-w-xl cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-all duration-200 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950/40'
                : 'border-zinc-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20'
            }`}
            role="button"
            tabIndex={0}
            aria-label="Upload a selfie"
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          >
            <UploadIcon />
            <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-200">
              {isDragging ? 'Drop your photo here' : 'Drag & drop your selfie'}
            </p>
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
              or click to browse &mdash; JPG, PNG, WebP up to 10 MB
            </p>
            <button
              type="button"
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={onFileChange}
            />
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Editor (shown after upload)                                       */}
        {/* ---------------------------------------------------------------- */}
        {showEditor && (
          <div className="space-y-8">
            {/* Status banner */}
            {job.status === 'uploading' && (
              <StatusBanner color="blue">
                <Spinner size={16} /> Uploading your photo&hellip;
              </StatusBanner>
            )}
            {job.status === 'processing' && (
              <StatusBanner color="violet">
                <Spinner size={16} /> {activeAction ?? 'Processing'}&hellip; this may take a moment
              </StatusBanner>
            )}
            {job.status === 'failed' && (
              <StatusBanner color="red">
                {job.error ?? 'Something went wrong'}
                <button
                  className="ml-3 text-sm underline"
                  onClick={() =>
                    setJob((prev) => ({ ...prev, status: hasJob ? 'pending' : 'idle', error: null }))
                  }
                >
                  Dismiss
                </button>
              </StatusBanner>
            )}
            {job.status === 'completed' && (
              <StatusBanner color="green">
                Done! Your image is ready.
              </StatusBanner>
            )}

            {/* Before / After */}
            <div className="grid gap-6 md:grid-cols-2">
              <ImagePanel label="Original" url={previewUrl} />
              <ImagePanel
                label="Result"
                url={job.resultUrl}
                loading={isProcessing}
                placeholder="Apply a transformation to see the result here"
              />
            </div>

            {/* Controls */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Transformations
              </h2>

              {/* Action buttons */}
              <div className="mb-6 flex flex-wrap gap-3">
                <ActionButton
                  label="Remove Background"
                  icon="✂️"
                  onClick={handleRemoveBg}
                  disabled={!hasJob || isProcessing}
                  loading={activeAction === 'Remove Background'}
                />
                <ActionButton
                  label="Enhance Face"
                  icon="✨"
                  onClick={handleEnhanceFace}
                  disabled={!hasJob || isProcessing}
                  loading={activeAction === 'Enhance Face'}
                />
                <ActionButton
                  label="Apply Style"
                  icon="🎨"
                  onClick={handleApplyStyle}
                  disabled={!hasJob || isProcessing}
                  loading={activeAction === 'Apply Style'}
                  primary
                />
              </div>

              {/* Style presets */}
              <div>
                <p className="mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  Style Preset
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                  {STYLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedStyle(preset.id)}
                      disabled={isProcessing}
                      className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center text-xs font-medium transition ${
                        selectedStyle === preset.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600'
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <span className="text-xl">{preset.icon}</span>
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                  {STYLE_PRESETS.find((p) => p.id === selectedStyle)?.description}
                </p>
              </div>
            </div>

            {/* Download / Reset */}
            <div className="flex flex-wrap items-center gap-3">
              {job.status === 'completed' && job.resultUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download Result
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Start Over
              </button>
            </div>

            {/* Tech note */}
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              Images are processed on the server and automatically deleted after 1 hour. No account
              required. Powered by{' '}
              <span className="font-medium">rembg</span>,{' '}
              <span className="font-medium">Stable Diffusion</span> and{' '}
              <span className="font-medium">GFPGAN</span>.
            </p>
          </div>
        )}

        {/* Features section (shown on idle) */}
        {!showEditor && (
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: '✂️',
                title: 'Background Removal',
                desc: 'Remove any background instantly using rembg – no greenscreen needed.',
              },
              {
                icon: '🎨',
                title: 'Style Transfer',
                desc: 'Apply 7 artistic presets powered by Stable Diffusion + ControlNet.',
              },
              {
                icon: '✨',
                title: 'Face Enhancement',
                desc: 'Sharpen and restore facial details with GFPGAN / CodeFormer.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 font-semibold text-zinc-900 dark:text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBanner({
  color,
  children,
}: {
  color: 'blue' | 'violet' | 'green' | 'red';
  children: React.ReactNode;
}) {
  const styles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    violet: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    red: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
  };
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium ${styles[color]}`}>
      {children}
    </div>
  );
}

function ImagePanel({
  label,
  url,
  loading = false,
  placeholder,
}: {
  label: string;
  url: string | null;
  loading?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>
      <div className="relative flex min-h-72 items-center justify-center p-4">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
            <Spinner size={32} />
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Processing…</p>
          </div>
        )}
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={label}
            className="max-h-96 w-full rounded-xl object-contain"
          />
        ) : (
          <p className="text-center text-sm text-zinc-400 dark:text-zinc-600">
            {placeholder ?? 'No image yet'}
          </p>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  disabled,
  loading,
  primary = false,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        primary
          ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
          : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
      }`}
    >
      {loading ? <Spinner size={16} /> : <span aria-hidden>{icon}</span>}
      {label}
    </button>
  );
}
