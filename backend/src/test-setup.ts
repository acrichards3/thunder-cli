import { drizzle } from "drizzle-orm/bun-sql";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { SQL } from "bun";
import { raise } from "@vex-app/lib";

Object.assign(Bun.env, {
  AUTH_SECRET: "test-secret-for-testing-only",
  DATABASE_URL: "postgres://postgres:test@localhost:5433/test",
  GOOGLE_CLIENT_ID: "test-client-id",
  GOOGLE_CLIENT_SECRET: "test-client-secret",
});

const client = new SQL(Bun.env.DATABASE_URL ?? raise("DATABASE_URL not set"));
const db = drizzle({ client });

await migrate(db, { migrationsFolder: "./src/db/migrations" });
await client.end();
