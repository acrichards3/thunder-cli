import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.url(),
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
