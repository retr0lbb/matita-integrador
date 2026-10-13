import { DomainError } from "../../../shared/domains/domain.error";

export class ClassNotActiveError extends DomainError {
  constructor() {
    super("Classroom is not active yet", 400);
  }
}
