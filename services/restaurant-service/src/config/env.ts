import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(4001),

  MONGODB_URI: z.string().min(1),

  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("debug"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid Restaurant Service configuration:");
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;
