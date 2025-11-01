import { z } from "zod";

export const envSchema = z.object({
  VITE_BACKEND_URL: z.url(),
  VITE_PORT: z.coerce.number().default(5173),
} satisfies Record<`VITE_${string}`, z.ZodType<unknown>>);

export function validatedEnv() {
  // At build time (Node.js/vite.config.ts), use process.env (dotenv loaded in vite.config.ts)
  // At runtime (browser), use import.meta.env
  const nodeEnv =
    typeof window === "undefined"
      ? (
          globalThis as {
            process?: { env?: Record<string, string | undefined> };
          }
        ).process?.env
      : undefined;
  const envSource = nodeEnv ?? import.meta.env;

  const result = envSchema.safeParse(envSource);

  if (!result.success) {
    console.error("❌ Invalid Environment Variables");
    result.error.issues.forEach((issue) => {
      console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    });
    throw new Error("Invalid environment variables");
  }

  return result.data;
}

export const env = validatedEnv();
