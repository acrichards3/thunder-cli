import { drizzle } from "drizzle-orm/bun-sql";
import { env } from "../env/env";
import { SQL } from "bun";

const client = new SQL(env.DATABASE_URL);
export const db = drizzle({ client });
