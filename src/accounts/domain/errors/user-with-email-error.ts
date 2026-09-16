import { DomainError } from "../../../shared/domains/domain.error";

export class UserWithSameEmailAlreadyExistsInProvider extends DomainError{
    code = "EMAIL_ALREADY_EXISTS_IN_PROVIDER";
    constructor(){
        super("User email already existis in provider")
    }
}