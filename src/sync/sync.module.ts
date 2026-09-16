import { Module } from '@nestjs/common';
import { GoogleSyncScheduler } from './services/account.cron';
import { AccountModule } from '../accounts/accounts.module';

@Module({
    imports: [AccountModule],
    providers:[
        GoogleSyncScheduler
    ]
})
export class SyncModule {}
