import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("No database url provided");
}

const prisma = new PrismaClient();

export default prisma;
