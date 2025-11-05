import { cors } from "hono/cors";
import { db } from "./db/index";
import { env } from "./env/env";
import { Hono } from "hono";
import { users } from "./db/schema/users";

const app = new Hono<{ Variables: { db: typeof db } }>();

// Middleware to set db in context
app.use("*", async (c, next) => {
  c.set("db", db);
  await next();
});

// ! Update CORS settings as needed
app.use(
  "*",
  cors({
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    origin: "*",
  })
);

app.get("/", (c) => {
  return c.json({ message: "Hello from Hono!" });
});

app.get("/api/users", async (c) => {
  const db = c.get("db");
  const allUsers = await db.select().from(users);
  return c.json(allUsers);
});

console.log(`🚀 Server running on http://localhost:${env.PORT}`);

export default {
  fetch: app.fetch,
  port: env.PORT,
};
