import { z } from "zod";

export const envSchema = z.object({
  AUTH_SECRET: z.string().min(1),
  DATABASE_URL: z.url(),
  FRONTEND_URL: z.url().default("http://localhost:5173"),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  PORT: z.coerce.number().default(3000),
});

export function validatedEnv() {
  const result = envSchema.safeParse(Bun.env);

  if (!result.success) {
    console.error("❌ Invalid Environment Variables");
    result.error.issues.forEach((issue) => {
      console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    });
    process.exit(1);
  }

  return result.data;
}

export const env = validatedEnv();
