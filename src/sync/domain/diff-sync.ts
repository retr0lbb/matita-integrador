import { SyncRecord } from "./sync-record";

export type SyncDiffResult = {
  toCreate: SyncRecord[];
  toUpdate: Array<{ current: SyncRecord; incoming: SyncRecord }>;
  toRemove: SyncRecord[];
};


export function generateDiffReport(incoming: SyncRecord[], current: SyncRecord[]):SyncDiffResult {
    const currentByExternalId = new Map(current.map(r => [r.lexExternalId, r]));
    const incomingByExternalId = new Map(incoming.map(r => [r.lexExternalId, r]));

    const toCreate: SyncRecord[] = [];
    const toUpdate: SyncDiffResult['toUpdate'] = [];

    for(const incomingRecord of incoming){
        const currentRecord = currentByExternalId.get(incomingRecord.lexExternalId)

        if(!currentRecord){
            toCreate.push(incomingRecord)
            continue
        }


        if(hasChange(currentRecord, incomingRecord)){
            toUpdate.push({current: currentRecord, incoming: incomingRecord})
        }
    }

    const toRemove = current.filter(r => !incomingByExternalId.has(r.lexExternalId));
    return { toCreate, toUpdate, toRemove };
}

function hasChange(current: SyncRecord, other: SyncRecord){
    if(current.syncHash && other.syncHash){
        return current.syncHash !== other.syncHash
    }
    return(
        current.firstName !== other.firstName ||
        current.lastName !== other.firstName ||
        current.email !== other.email ||
        current.turmaExternalId !== other.turmaExternalId ||
        current.role !== other.role
    )

}