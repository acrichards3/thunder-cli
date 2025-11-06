import Google from "@auth/core/providers/google";
import { accounts, sessions, verificationTokens } from "./db/schema/auth";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { db } from "./db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { createSecureAdapter } from "./security/secureAdapter";
import { env } from "./env/env";
import { Hono } from "hono";
import { initAuthConfig, verifyAuth, authHandler } from "@hono/auth-js";
import { rateLimit } from "./security/rateLimit";
import { secureHeaders } from "hono/secure-headers";
import { users } from "./db/schema/users";

const app = new Hono<{ Variables: { db: typeof db } }>();

// !- Update CORS settings as needed
app.use(
  "*",
  cors({
    allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    origin: env.FRONTEND_URL,
  }),
);

// Set secure headers
app.use("*", secureHeaders());

// Set CSRF protection
app.use("*", csrf());

// !- Rate limit auth endpoints (sign-in, callbacks, etc.)
app.use(
  "/api/auth/*",
  rateLimit({
    limit: 10,
    windowMs: 60_000,
  }),
);

// Middleware to set db in context
app.use("*", async (c, next) => {
  c.set("db", db);
  await next();
});

// Initialize auth config
app.use(
  "*",
  initAuthConfig((_c) => ({
    adapter: createSecureAdapter(
      DrizzleAdapter(db, {
        accountsTable: accounts,
        sessionsTable: sessions,
        usersTable: users,
        verificationTokensTable: verificationTokens,
      }),
      { oauthEncryptionKey: env.OAUTH_TOKEN_ENCRYPTION_KEY },
    ),
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
    trustHost: env.ENVIRONMENT === "development" ? true : false,
  })),
);

// Mount auth routes (required for sign-in to work)
app.use("/api/auth/*", authHandler());

// Set up protected routes
app.use("/api/protected/*", verifyAuth());

// !- You can delete this example route
app.get("/", (c) => {
  return c.json({ message: "Hello from Hono!" });
});

console.log(`🚀 Server running on http://localhost:${env.PORT}`);

export default {
  fetch: app.fetch,
  port: env.PORT,
};
