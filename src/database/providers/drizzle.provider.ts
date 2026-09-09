import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { ConfigService } from "@nestjs/config"

export const DRIZZLE = Symbol("DRIZZLE")

export const drizzleProvider = {
    provide: DRIZZLE,
    useFactory: (configService: ConfigService) => {
        const pool = new Pool({connectionString: configService.getOrThrow<string>("DATABASE_URL") });
        return drizzle({client: pool})
    },
    inject: [ConfigService],
}