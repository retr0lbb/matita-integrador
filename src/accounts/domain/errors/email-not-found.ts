import { DomainError } from "../../../shared/domains/domain.error";

export class EmailNotFond extends DomainError{
    code = "EMAIL NOT FOUND"

    constructor(){
        super("Email not found")
    }
}