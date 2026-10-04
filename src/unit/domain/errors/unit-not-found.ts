import { DomainError } from "../../../shared/domains/domain.error";

export class UnitNotFound extends DomainError{
    code: string = "UNIT_NOT_FOUND"

    constructor(){
        super("Unit Not found")
    }
}