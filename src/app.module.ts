import { Module } from "@nestjs/common";
import { UserModule } from "./users/user.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { AccountModule } from "./accounts/accounts.module";
import { InstitutionModule } from "./institutions/instutution.module";
import { UnitModule } from "./unit/unit.module";
import { ClassRoomModule } from "./classroom/classroom.module";
import { SyncModule } from './sync/sync.module';

@Module({
  imports: 
  [
    UserModule, 
    DatabaseModule,
    AccountModule, 
    InstitutionModule,
    UnitModule,
    ClassRoomModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SyncModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
