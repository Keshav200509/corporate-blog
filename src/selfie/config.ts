import path from 'path';
import type { StylePresetConfig } from './types';

export const SELFIE_CONFIG = {
  tempDir: path.join(process.cwd(), 'temp', 'selfie-jobs'),
  maxFileSizeMB: 10,
  maxFileSizeBytes: 10 * 1024 * 1024,
  cleanupAfterMs: 60 * 60 * 1000, // 1 hour
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],

  // AI service endpoints – set via environment variables.
  // When unset the service falls back to a transparent mock (no-op copy).
  rembgUrl: process.env.REMBG_API_URL ?? null,
  gfpganUrl: process.env.GFPGAN_API_URL ?? null,
  sdUrl: process.env.STABLE_DIFFUSION_URL ?? null,
} as const;

export const STYLE_PRESETS: StylePresetConfig[] = [
  {
    id: 'professional',
    label: 'Professional',
    description: 'Clean corporate headshot',
    icon: '💼',
    prompt:
      'professional corporate headshot, office background, formal attire, sharp focus, studio lighting, high quality photograph',
  },
  {
    id: 'casual',
    label: 'Casual',
    description: 'Relaxed, approachable',
    icon: '😊',
    prompt:
      'casual portrait, natural outdoor lighting, friendly smile, relaxed modern style, high quality photograph',
  },
  {
    id: 'fantasy',
    label: 'Fantasy',
    description: 'Epic fantasy world',
    icon: '🧙',
    prompt:
      'fantasy character portrait, magical forest background, epic dramatic lighting, high fantasy concept art',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    description: 'Neon-lit dystopia',
    icon: '🤖',
    prompt:
      'cyberpunk portrait, neon lights, futuristic city background, rain reflections, cinematic dramatic lighting',
  },
  {
    id: 'watercolor',
    label: 'Watercolor',
    description: 'Painterly illustration',
    icon: '🎨',
    prompt:
      'watercolor painting portrait, soft pastel colors, artistic brush strokes, impressionist style illustration',
  },
  {
    id: 'anime',
    label: 'Anime',
    description: 'Japanese animation style',
    icon: '⛩️',
    prompt:
      'anime style portrait, vibrant colors, clean cell-shaded outlines, studio ghibli inspired illustration',
  },
  {
    id: 'oil-painting',
    label: 'Oil Painting',
    description: 'Classic fine art',
    icon: '🖼️',
    prompt:
      'oil painting portrait, renaissance style, rich warm colors, dramatic chiaroscuro lighting, museum quality',
  },
];
