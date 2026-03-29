/**
 * Returns true only if DATABASE_URL is set, parseable as a URL, uses a
 * postgres protocol, and has a numeric-only port when a port is present.
 *
 * Using new URL() alone is not enough — Node accepts non-numeric ports for
 * custom protocols. This function adds an explicit port digit-check so that
 * a Netlify placeholder like "postgresql://host:INVALID/db" returns false
 * and prevents Prisma from throwing PrismaClientInitializationError at build.
 */
export function hasDatabase(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (!["postgresql:", "postgres:"].includes(parsed.protocol)) return false;
    if (parsed.port && !/^\d+$/.test(parsed.port)) return false;
    if (!parsed.hostname) return false;
    return true;
  } catch {
    return false;
  }
}
