import { apiFetch } from "./client.util";
import { z } from "zod";

// ? - This is an example file, feel free to delete once you start working on your own API.

const usersSchema = z.object({
  message: z.string(),
});

export const helloExample = async () => {
  const data = await apiFetch("/");
  const parsed = usersSchema.parse(data);
  return parsed;
};
