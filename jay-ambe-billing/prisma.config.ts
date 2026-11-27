import path from "path";
import { defineConfig } from "prisma/config";

const dbPath = `file:${path.join(process.cwd(), "prisma", "dev.db")}`;

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    seed: "ts-node --project tsconfig.seed.json prisma/seed.ts",
  },
  datasource: {
    url: dbPath,
  },
});
