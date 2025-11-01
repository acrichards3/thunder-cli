import { defineConfig } from "drizzle-kit";
import { raise } from "@ak-wedding/lib";

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL ?? raise("DATABASE_URL is not set"),
  },
  dialect: "postgresql",
  out: "./src/db/migrations",
  schema: "./src/db/schema/*",
});
