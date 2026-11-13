import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce.number().int().positive().default(4002),
    DATABASE_URL: z.string().url(),
    PRODUCT_SERVICE_URL: z.string().url(),
    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("debug"),
});
const result = envSchema.safeParse(process.env);
if (!result.success) {
    console.error("Invalid Order Service configuration");
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
}
export const env = result.data;
//# sourceMappingURL=env.js.map