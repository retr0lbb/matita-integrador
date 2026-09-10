import { Module } from "@nestjs/common";
import { UserModule } from "./users/user.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { AccountModule } from "./accounts/accounts.module";

@Module({
  imports: 
  [
    UserModule, 
    DatabaseModule,
    AccountModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
