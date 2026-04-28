import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() ?? "";
}

export function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}

export function getPrismaClient() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = new PrismaClient({
      adapter: new PrismaPg(databaseUrl),
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
    });
  }

  return globalThis.prismaGlobal;
}

export async function runOptionalDatabaseQuery<T>(
  query: (client: PrismaClient) => Promise<T>
): Promise<T | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    return await query(getPrismaClient());
  } catch (error) {
    console.warn("Database query failed, using fallback content instead.", error);
    return null;
  }
}
