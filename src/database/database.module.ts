import { Module } from "@nestjs/common";
import { drizzleProvider } from "./providers/drizzle.provider";


@Module({
    providers: [drizzleProvider],
    exports: [drizzleProvider],
})
export class DatabaseModule{}