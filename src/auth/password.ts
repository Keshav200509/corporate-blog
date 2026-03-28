import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const ITERATIONS = 120000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `${ITERATIONS}:${salt}:${derived}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  const [iterationValue, salt, storedHash] = hash.split(":");
  if (!iterationValue || !salt || !storedHash) {
    return false;
  }

  const iterations = Number.parseInt(iterationValue, 10);
  if (!Number.isFinite(iterations)) {
    return false;
  }

  const candidateHash = pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST).toString("hex");
  return timingSafeEqual(Buffer.from(candidateHash), Buffer.from(storedHash));
}
