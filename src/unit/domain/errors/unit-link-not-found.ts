import { NotFoundError } from "../../../shared/domains/not-found.error";

export class UnitLinkNotFound extends NotFoundError {
  constructor() {
    super("Unit Link not found");
  }
}
