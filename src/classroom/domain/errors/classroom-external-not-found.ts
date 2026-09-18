import { DomainError } from "../../../shared/domains/domain.error";

export class ClassroomExternalIdNotFound extends DomainError{
    code = "CLASSROOM_NOT_FOUND";
    constructor(){
        super("Classroom External ID not found")
    }
}