import { NotFoundError } from "../../../shared/domains/not-found.error";

export class UnitNotFound extends NotFoundError {
  constructor() {
    super("Unit Not found");
  }
}
