import Google from "@auth/core/providers/google";
import { accounts, sessions, verificationTokens } from "./db/schema/auth";
import { cors } from "hono/cors";
import { db } from "./db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { env } from "./env/env";
import { Hono } from "hono";
import { initAuthConfig, verifyAuth, authHandler } from "@hono/auth-js";
import { users } from "./db/schema/users";

const app = new Hono<{ Variables: { db: typeof db } }>();

// Middleware to set db in context
app.use("*", async (c, next) => {
  c.set("db", db);
  await next();
});

// Update CORS settings as needed
app.use(
  "*",
  cors({
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    origin: "*", // TODO: Update me!
  })
);

// Initialize auth config
app.use(
  "*",
  initAuthConfig(() => ({
    adapter: DrizzleAdapter(db, {
      accountsTable: accounts,
      sessionsTable: sessions,
      usersTable: users,
      verificationTokensTable: verificationTokens,
    }),
    // ? - Manually add new providers here
    providers: [
      Google({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    secret: env.AUTH_SECRET,
    session: { strategy: "database" },
  }))
);

// Set up protected routes
app.use("/api/protected/*", verifyAuth());

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
