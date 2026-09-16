import { DomainError } from "../../../shared/domains/domain.error";

export class UserAlreadyExistisError extends DomainError{
    code = "USER_ALREADY_EXISTS"
    constructor(){
        super("User Already exists in database")
    }   
}