import { drizzle } from "drizzle-orm/bun-sql";
import { env } from "../env/env";
import { raise } from "@thunder-app/lib";
import { SQL } from "bun";

const client = new SQL(
  env.DATABASE_URL ?? raise("DATABASE_URL environment variable is not set"),
);
export const db = drizzle({ client });
