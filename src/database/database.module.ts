import { Module } from "@nestjs/common";
import { drizzleProvider } from "./providers/drizzle.provider";
import { ConfigModule } from "@nestjs/config";


@Module({
    providers: [drizzleProvider],
    exports: [drizzleProvider],
    imports: [ConfigModule]
})
export class DatabaseModule{}