// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "@prisma/client/extension";
// import { env } from "./env.js";
// const adapter = new PrismaPg({
//   connectionString: env.DATABASE_URL,
// });
// export const prisma = new PrismaClient({
//   adapter,
//   log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
// });
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "./env.js";
const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
});
export const prisma = new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});
//# sourceMappingURL=prisma.js.map