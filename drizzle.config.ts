import {defineConfig} from "drizzle-kit"
import 'dotenv/config';

export default defineConfig({
    dialect: "postgresql",
    out: "./drizzle",
    schema: "./src/database/schemas/*",
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
})