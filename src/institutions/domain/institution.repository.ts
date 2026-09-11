import { Institution } from "./institution.entity"

export const INSTITUTION_REPOSITORY = Symbol('INSTITUTION_REPOSITORY');

export interface InstitutionRepository{
    save(account: Institution): Promise<void>
    findById(id: string): Promise<Institution | null>
    listInstitutions(): Promise<Institution[]>
    findByApiKey(apiKey: string): Promise<Institution | null>
}