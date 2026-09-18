import { DomainError } from "../../../shared/domains/domain.error";

export class ClassroomNotFoun extends DomainError{
    code: string = "CLASSROOM_NOT_FOUND"
    constructor(){
        super("Classroom not found")
    }
}