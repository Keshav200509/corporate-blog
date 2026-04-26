import { PrismaClient } from "@prisma/client";

declare global {
  var prismaClientSingleton: PrismaClient | undefined;
}

function createUnavailablePrismaClient(reason: string): PrismaClient {
  return new Proxy(
    {},
    {
      get() {
        return () => {
          throw new Error(reason);
        };
      }
    }
  ) as PrismaClient;
}

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    return createUnavailablePrismaClient("Prisma client unavailable: DATABASE_URL environment variable is not set");
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"]
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return createUnavailablePrismaClient(`Prisma client failed to initialize: ${message}`);
  }
}

export const prisma = globalThis.prismaClientSingleton ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && process.env.DATABASE_URL) {
  globalThis.prismaClientSingleton = prisma;
}
