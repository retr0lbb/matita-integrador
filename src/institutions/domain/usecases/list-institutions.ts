import { Inject } from "@nestjs/common";
import { INSTITUTION_REPOSITORY, type InstitutionRepository } from "../institution.repository";



export class listInstitutionsUseCase{
    constructor(
        @Inject(INSTITUTION_REPOSITORY) private readonly instRepository: InstitutionRepository 
    ){}

    async execute(){
        const institutions = await this.instRepository.listInstitutions()

        const instArr = institutions.map(inst => ({
            id: inst.id,
            name: inst.name
        }))

        return instArr 
    }
}