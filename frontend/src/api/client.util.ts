import { z } from "zod";
import { env } from "../env/env";

const errorResponseSchema = z.object({
  message: z.unknown().optional(),
});

export async function apiFetch(
  path: string,
  init?: RequestInit
): Promise<unknown> {
  const url = `${env.VITE_BACKEND_URL}${path}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    const body: unknown = isJson
      ? await response.json().catch(() => undefined)
      : undefined;
    const parsed = errorResponseSchema.safeParse(body);
    const errorMessage =
      parsed.success && parsed.data.message !== undefined
        ? String(parsed.data.message)
        : response.statusText;
    throw new Error(`Request failed ${response.status}: ${errorMessage}`);
  }

  if (!isJson) {
    console.warn("Response is not JSON");
    return null;
  }

  return await response.json();
}
