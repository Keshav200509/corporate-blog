/**
 * Returns true only if DATABASE_URL is set AND is a parseable URL.
 * Prevents Prisma from throwing PrismaClientInitializationError at build time
 * when the env var is set to a placeholder or malformed value.
 */
export function hasDatabase(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
