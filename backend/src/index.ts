import { Hono } from "hono";
import { cors } from "hono/cors";
import { greet, type User } from "@ak-wedding/lib";
import { env } from "./env/env";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
  }),
);

app.get("/", (c) => {
  return c.json({ message: greet("AK Wedding API") });
});

app.get("/api/users", (c) => {
  const users: User[] = [
    { email: "alex@example.com", id: "1", name: "Alex" },
    { email: "kara@example.com", id: "2", name: "Kara" },
  ];
  return c.json(users);
});

console.log(`🚀 Server running on http://localhost:${env.PORT}`);

export default {
  fetch: app.fetch,
  port: env.PORT,
};
