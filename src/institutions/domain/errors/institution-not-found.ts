import { NotFoundError } from "../../../shared/domains/not-found.error";

export class InstitutionNotFound extends NotFoundError {
  constructor() {
    super("Institution Not Found");
  }
}
