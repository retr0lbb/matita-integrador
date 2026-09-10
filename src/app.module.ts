import { Module } from "@nestjs/common";
import { UserModule } from "./users/user.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: 
  [UserModule, DatabaseModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
