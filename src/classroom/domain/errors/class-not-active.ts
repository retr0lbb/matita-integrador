import { DomainError } from "../../../shared/domains/domain.error";

export class ClassNotActiveError extends DomainError{
    code = "CLASS NOT ACTIVE YET"

    constructor(){
        super("Classroom is not active yet")
    }
}