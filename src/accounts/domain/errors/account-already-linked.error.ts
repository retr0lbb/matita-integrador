import { DomainError } from "../../../shared/domains/domain.error";

export class AccountAlreadyLinkedError extends DomainError {
  code: string;
  constructor(code: string) {
    super("Account already linked to Google");
    this.code = code
  }
}
