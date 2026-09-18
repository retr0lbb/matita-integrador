import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { ImportGoogleAccountsUseCase } from "../../accounts/app/import-google-users.usecase";

@Injectable()
export class GoogleSyncScheduler{
 constructor(
    private readonly importFromGoogle: ImportGoogleAccountsUseCase
 ){}


 @Cron('0 0 * * *', { //roda as 9 horas
  name: "PULL From Google",
  timeZone: 'America/Sao_Paulo',
 })
 async handleSync(){
   console.log("[CRON] Iniciando sincronização Google...");
    // console.log(await this.importFromGoogle.execute("/Integrador-teste/Maplebear - Krypton"))
   console.log("[CRON] Sincronização Google finalizada.");
 }
}