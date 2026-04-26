import { headers } from "next/headers";

function envBaseUrl() {
  // Explicit override (highest priority)
  const explicit = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  // Vercel automatic URL
  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    return `https://${vercel.replace(/\/$/, "")}`;
  }

  // Netlify: DEPLOY_URL is the deploy-specific URL (works for previews too)
  const netlifyDeploy = process.env.DEPLOY_URL;
  if (netlifyDeploy) {
    return netlifyDeploy.replace(/\/$/, "");
  }

  // Netlify: URL is the primary site URL
  const netlifyUrl = process.env.URL;
  if (netlifyUrl) {
    return netlifyUrl.replace(/\/$/, "");
  }

  return null;
}

export async function getApiBaseUrl() {
  const fromEnv = envBaseUrl();
  if (fromEnv) {
    return fromEnv;
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}

export async function fetchApiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = await getApiBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  return (await response.json()) as T;
}
