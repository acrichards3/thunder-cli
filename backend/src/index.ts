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
  }),
);

// Initialize auth config
app.use(
  "*",
  initAuthConfig((_c) => ({
    adapter: DrizzleAdapter(db, {
      accountsTable: accounts,
      sessionsTable: sessions,
      usersTable: users,
      verificationTokensTable: verificationTokens,
    }),
    basePath: "/api/auth",
    callbacks: {
      async redirect({ baseUrl, url }) {
        // Redirect to frontend after sign-in/sign-out
        const frontendUrl = env.FRONTEND_URL;
        const frontendOrigin = new URL(frontendUrl).origin;
        const backendOrigin = new URL(baseUrl).origin;
        // If url is relative, make it absolute using the frontend URL
        if (url.startsWith("/")) return `${frontendUrl}${url}`;

        const urlObj = new URL(url);
        if (urlObj.origin === backendOrigin) return frontendUrl;
        if (urlObj.origin === frontendOrigin) return url;
        return frontendUrl;
      },
    },
    // ? - Manually add new providers here
    providers: [
      Google({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    secret: env.AUTH_SECRET,
    session: { strategy: "database" },
    trustHost: true, // Required for local development
  })),
);

// Mount auth routes (required for sign-in to work)
app.use("/api/auth/*", authHandler());

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

app.get("/api/protected/test", (c) => {
  return c.json({ message: "This message is from a protected route!" });
});

console.log(`🚀 Server running on http://localhost:${env.PORT}`);

export default {
  fetch: app.fetch,
  port: env.PORT,
};
