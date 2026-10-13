import { DomainError } from "../../../shared/domains/domain.error";


export class InstitutionLinkAlreadyExists extends DomainError {
  code: string;
  constructor(code: string) {
    super("Institution Link already Exists");
    this.code = code
  }
}