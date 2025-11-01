import { env } from "../env/env";

export type JsonRecord = Record<string, unknown>;

export async function apiFetch(path: string, init?: RequestInit): Promise<unknown> {
  const url = `${env.VITE_BACKEND_URL}${path}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    const body = isJson ? await response.json().catch(() => undefined) : undefined;
    const errorMessage =
      body && typeof body === "object" && "message" in body
        ? String((body as JsonRecord).message)
        : response.statusText;
    throw new Error(`Request failed ${response.status}: ${errorMessage}`);
  }

  if (!isJson) {
    return null;
  }

  return await response.json();
}
