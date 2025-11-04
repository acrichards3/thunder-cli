import { apiFetch } from "./client.util";
import { z } from "zod";
import type { User } from "@thunder-app/lib";

// ? - This is an example file, feel free to delete once you start working on your own API.

const usersSchema = z.array(
  z.object({
    email: z.email(),
    id: z.string(),
    name: z.string(),
  }),
);

export async function fetchUsers(): Promise<User[]> {
  const data = await apiFetch("/api/users");
  const parsed = usersSchema.parse(data);
  return parsed;
}
