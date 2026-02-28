/**
 * You probably won't need to touch this file. Edit schema.ts to add or change env variables.
 */
import { envSchema } from "./schema";

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

const result = envSchema.safeParse(getEnvSource());

export const envIssues: EnvIssue[] = result.success
  ? []
  : result.error.issues.map((issue) => ({
      message: issue.message,
      path: issue.path.join("."),
    }));
