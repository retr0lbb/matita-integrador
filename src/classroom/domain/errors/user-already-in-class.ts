import { DomainError } from "../../../shared/domains/domain.error";

export class UserAlreadyInClass extends DomainError{
    code = "USER_ALREADY_IN_CLASS"
    constructor(){
        super("User already in class")
    }
}