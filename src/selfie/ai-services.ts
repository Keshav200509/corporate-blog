/**
 * AI service integrations.
 *
 * Each function first checks whether the corresponding service URL is
 * configured via environment variables.  If it is, the real Docker-hosted
 * service is called.  Otherwise a transparent mock is used so that the
 * full request/response pipeline can be exercised without GPU hardware.
 *
 * Real service expected contracts
 * ────────────────────────────────
 * rembg   : POST <REMBG_API_URL>      multipart form-data field "file"  → image/png
 * GFPGAN  : POST <GFPGAN_API_URL>/restore  multipart field "image"      → image/jpeg
 * SD WebUI: POST <STABLE_DIFFUSION_URL>/sdapi/v1/img2img  JSON body     → JSON { images: [base64] }
 */

import { SELFIE_CONFIG } from './config';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function fetchImage(url: string, body: FormData | string, isJson = false): Promise<Buffer> {
  const headers: Record<string, string> = isJson ? { 'Content-Type': 'application/json' } : {};
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: body as BodyInit,
  });
  if (!response.ok) {
    throw new Error(`AI service error ${response.status}: ${await response.text()}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// Helper to convert Buffer to Uint8Array for Web APIs
function toUint8Array(buf: Buffer): Uint8Array {
  if (buf instanceof Uint8Array) return buf;
  return new Uint8Array(buf);
}

// ---------------------------------------------------------------------------
// Background removal  (rembg)
// ---------------------------------------------------------------------------

/**
 * Remove image background using rembg.
 *
 * rembg server: `rembg s`  (listens on :7000 by default)
 * POST / with form field "file"  →  PNG with transparent background
 */
export async function removeBackground(imageBuffer: Buffer, mimeType: string): Promise<Buffer> {
  if (SELFIE_CONFIG.rembgUrl) {
    const form = new FormData();
    const arr = toUint8Array(imageBuffer);
    form.append('file', new Blob([arr] as BlobPart[], { type: mimeType }), 'image');
    return fetchImage(SELFIE_CONFIG.rembgUrl, form);
  }

  // Mock: 1-second delay then return original unchanged
  console.info('[selfie/mock] REMBG_API_URL not set – returning original as background-removed');
  await sleep(1000);
  return imageBuffer;
}

// ---------------------------------------------------------------------------
// Style transfer  (Stable Diffusion img2img + ControlNet)
// ---------------------------------------------------------------------------

/**
 * Apply a style preset via Stable Diffusion img2img.
 *
 * SD WebUI API: POST /sdapi/v1/img2img
 * Body: JSON { init_images, prompt, negative_prompt, denoising_strength, … }
 * Response: JSON { images: [base64String] }
 */
export async function applyStyle(
  imageBuffer: Buffer,
  _mimeType: string,
  prompt: string,
): Promise<Buffer> {
  if (SELFIE_CONFIG.sdUrl) {
    const imageB64 = imageBuffer.toString('base64');
    const payload = JSON.stringify({
      init_images: [imageB64],
      prompt,
      negative_prompt: 'ugly, blurry, low quality, deformed, distorted, poorly drawn',
      denoising_strength: 0.65,
      steps: 30,
      cfg_scale: 7,
      width: 512,
      height: 512,
    });
    const resultBuf = await fetchImage(`${SELFIE_CONFIG.sdUrl}/sdapi/v1/img2img`, payload, true);
    // SD WebUI returns JSON; resultBuf is the raw JSON bytes
    const json = JSON.parse(resultBuf.toString('utf-8')) as { images: string[] };
    return Buffer.from(json.images[0], 'base64');
  }

  console.info('[selfie/mock] STABLE_DIFFUSION_URL not set – returning original as styled image');
  await sleep(1500);
  return imageBuffer;
}

// ---------------------------------------------------------------------------
// Face enhancement  (GFPGAN / CodeFormer)
// ---------------------------------------------------------------------------

/**
 * Enhance / restore face using GFPGAN.
 *
 * Typical FastAPI wrapper: POST /restore  field "image"  →  image/jpeg
 */
export async function enhanceFace(imageBuffer: Buffer, mimeType: string): Promise<Buffer> {
  if (SELFIE_CONFIG.gfpganUrl) {
    const form = new FormData();
    const arr = toUint8Array(imageBuffer);
    form.append('image', new Blob([arr] as BlobPart[], { type: mimeType }), 'face.jpg');
    return fetchImage(`${SELFIE_CONFIG.gfpganUrl}/restore`, form);
  }

  console.info('[selfie/mock] GFPGAN_API_URL not set – returning original as enhanced image');
  await sleep(1000);
  return imageBuffer;
}
