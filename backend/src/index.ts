import { Hono } from "hono";
import { cors } from "hono/cors";
import { greet, type User } from "@thunder-app/lib";
import { env } from "./env/env";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
  }),
);

app.get("/", (c) => {
  return c.json({ message: greet("Thunder App API") });
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
