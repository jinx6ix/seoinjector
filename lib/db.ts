import { PrismaClient } from "@prisma/client"

// Extend the global object to prevent multiple Prisma instances during development
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

// Initialize PrismaClient once
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })

// Prevent reinitializing Prisma in development (Hot Reload Fix)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
