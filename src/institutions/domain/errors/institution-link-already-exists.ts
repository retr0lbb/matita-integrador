import { ConflictError } from "../../../shared/domains/conflict.error";

export class InstitutionLinkAlreadyExists extends ConflictError {
  constructor() {
    super("Institution Link already Exists");
  }
}
