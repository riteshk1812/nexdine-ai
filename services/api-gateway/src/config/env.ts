import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default("/api/v1"),
  FRONTEND_URL: z.string().url(),
  LOG_LEVEL: z
    .enum(["error", "info", "http", "verbose", "debug", "silly"])
    .default("debug"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid env configuration");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;
