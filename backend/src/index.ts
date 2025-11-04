import { cors } from "hono/cors";
import { env } from "./env/env";
import { Hono } from "hono";
import type { User } from "@thunder-app/lib";

const app = new Hono();

app.use(
  "*",
  cors({
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
