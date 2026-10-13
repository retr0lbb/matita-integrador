import { NotFoundError } from "../../../shared/domains/not-found.error";

export class AccountNotFoundError extends NotFoundError {
  constructor() {
    super("Account not found");
  }
}
