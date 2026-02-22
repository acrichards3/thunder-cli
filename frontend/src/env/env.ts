import { z } from "zod";

/**
 * Add env variables here as needed. Note that VITE_ prefix is required for frontend variables.
 * Also remember that these variables are public!
 */
export const envSchema = z.object({
  VITE_BACKEND_URL: z.url(),
  VITE_PORT: z.coerce.number().default(5173),
} satisfies Record<`VITE_${string}`, z.ZodType<unknown>>);

export type EnvIssue = { message: string; path: string };

function getEnvSource(): Record<string, unknown> {
  const nodeEnv =
    typeof window === "undefined"
      ? (
          globalThis as {
            process?: { env?: Record<string, string | undefined> };
          }
        ).process?.env
      : undefined;
  return nodeEnv ?? import.meta.env;
}

function parseEnv(): { data: z.infer<typeof envSchema> | null; issues: EnvIssue[] } {
  const result = envSchema.safeParse(getEnvSource());

  if (!result.success) {
    return {
      data: null,
      issues: result.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path.join("."),
      })),
    };
  }

  return { data: result.data, issues: [] };
}

const parsed = parseEnv();

export const envIssues: EnvIssue[] = parsed.issues;
export const env = parsed.data;
