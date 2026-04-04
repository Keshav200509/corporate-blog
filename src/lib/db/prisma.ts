import { PrismaClient } from "@prisma/client";

declare global {
  var prismaClientSingleton: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"]
  });
}

function getPrismaClient(): PrismaClient {
  if (globalThis.prismaClientSingleton) {
    return globalThis.prismaClientSingleton;
  }

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalThis.prismaClientSingleton = client;
  }

  return client;
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

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient() as any;
    const value = client[prop];

    return typeof value === "function" ? value.bind(client) : value;
  }
});
