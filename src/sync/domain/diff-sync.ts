import { UserAccountSyncRecord } from "./entities/userAccount-sync-record";


// quando provider eh igual ao lex
// deve retornar um UserAccountSyncRecords? vou dizer que sim
// essa funcao deve deletar? eu com certeza vou colocar triggers no banco de dados
// o que fazer quando a lex mudar o ID dos registros
// vou ver de tentar fazer um reconciliador
// da ate pra tentar fazer uma divisao por bucket para ver se fica top
// essa funcao juntamente com a classe da pra fazer usando generics
export type GenerateDiffResult = {
    toCreate: UserAccountSyncRecord[]
    toUpdate: UserAccountSyncRecord[]
} 

export function generateDiffReport(incoming: UserAccountSyncRecord[], current: UserAccountSyncRecord[]) {
    const currentByExternalId = new Map(current.map(r => [r.getExternalId(), r]));
    const incomingByExternalId = new Map(incoming.map(r => [r.getExternalId(), r]));

    const toCreate: UserAccountSyncRecord[] = [];
    const toUpdate: UserAccountSyncRecord[] = [];

    //nao sei o que fazer com o ID nulo ainda
    // ai que ta vamos comparar por provider ou seja
    // lex com lex atual e google com google atual?
    // se sim como fica o fluxo inverso?
    for(const incomingRecord of incoming){
        const currentRecord = currentByExternalId.get(incomingRecord.getExternalId())

        if(!currentRecord){
            toCreate.push(incomingRecord) //aqui guardamos os dados para depois criar as contas
                                         // da pra tentar guardar so o ID mas vou fazer mais simples
            continue
        }

        if(currentRecord.hasChanged(incomingRecord)){

        }
    }

    return { toCreate, toUpdate };
}