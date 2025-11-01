import { z } from "zod";
import { apiFetch } from "./client.util";
import type { User } from "@thunder-app/lib";

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
