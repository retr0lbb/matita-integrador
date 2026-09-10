import { DomainError } from "../../shared/domains/domain.error";

export class UserNotFoundError extends DomainError {
  constructor() {
    super("User not found");
  }
}
