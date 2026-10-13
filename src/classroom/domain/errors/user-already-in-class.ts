import { ConflictError } from "../../../shared/domains/conflict.error";

export class UserAlreadyInClass extends ConflictError {
  constructor() {
    super("User already in class");
  }
}
