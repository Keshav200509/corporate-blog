import { PrismaClient } from "@prisma/client";

declare global {
  var prismaClientSingleton: PrismaClient | undefined;
}

function createUnavailablePrismaClient(): PrismaClient {
  return new Proxy(
    {},
    {
      get() {
        return () => {
          throw new Error("Prisma client unavailable: DATABASE_URL is missing or invalid");
        };
      }
    }
  ) as PrismaClient;
}

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    return createUnavailablePrismaClient();
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"]
    });
  } catch {
    return createUnavailablePrismaClient();
  }
}

export const prisma = globalThis.prismaClientSingleton ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && process.env.DATABASE_URL) {
  globalThis.prismaClientSingleton = prisma;
}
