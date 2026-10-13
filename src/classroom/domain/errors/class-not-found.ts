import { NotFoundError } from "../../../shared/domains/not-found.error";

export class ClassroomNotFound extends NotFoundError {
  constructor() {
    super("Classroom not found");
  }
}
