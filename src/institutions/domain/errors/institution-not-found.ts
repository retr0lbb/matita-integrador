import { DomainError } from "../../../shared/domains/domain.error";


export class InstitutionNotFound extends DomainError {
  code: string;
  constructor(code: string) {
    super("Institution Not Found");
    this.code = code
  }
}