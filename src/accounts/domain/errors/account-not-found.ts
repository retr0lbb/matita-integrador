import { DomainError } from "../../../shared/domains/domain.error";

export class AccountNotFoundError extends DomainError{
    code = "ACCOUNT_NOT_FOUND"

    constructor(){
        super("Account not found")
    }
}