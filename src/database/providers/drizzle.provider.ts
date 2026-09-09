import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schemas from "../schemas"

export const DRIZZLE = Symbol("DRIZZLE")

export const drizzleProvider = {
    provide: DRIZZLE,
    useFactory: () => {
        const pool = new Pool({connectionString: process.env.DATABASE_URL!});

        return drizzle({client: pool})
    }
}