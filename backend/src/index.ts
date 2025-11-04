import { cors } from "hono/cors";
import { env } from "./env/env";
import { Hono } from "hono";
import type { User } from "@thunder-app/lib";

const app = new Hono();

// ! Update CORS settings as needed
app.use(
  "*",
  cors({
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false,
    origin: "*",
  }),
);

app.get("/", (c) => {
  return c.json({ message: "Hello from Hono!" });
});

app.get("/api/users", (c) => {
  const users: User[] = [
    { email: "user1@example.com", id: "1", name: "User One" },
    { email: "user2@example.com", id: "2", name: "User Two" },
  ];
  return c.json(users);
});

console.log(`🚀 Server running on http://localhost:${env.PORT}`);

export default {
  fetch: app.fetch,
  port: env.PORT,
};
