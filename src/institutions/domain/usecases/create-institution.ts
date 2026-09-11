import { Inject, Injectable } from "@nestjs/common";
import { INSTITUTION_REPOSITORY, type InstitutionRepository } from "../institution.repository";
import { Institution } from "../institution.entity";
import { randomUUID } from "crypto";


type CreateInstitutionPayload = {
    name: string,
    apiKey: string
}

@Injectable()
export class CreateInstitutionUseCase{
    constructor(
        @Inject(INSTITUTION_REPOSITORY) private readonly repo: InstitutionRepository
    ){}

    async execute(payload: CreateInstitutionPayload){
        const model = Institution.create({id: randomUUID(), apiKey: payload.apiKey, name: payload.name})
        await this.repo.save(model)
    }
}