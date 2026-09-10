import { DomainError } from "../../shared/domains/domain.error";

export class AccountAlreadyLinkedError extends DomainError {
  constructor() {
    super("Account already linked to Google");
  }
}
