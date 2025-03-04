import { ApplicationError } from "app/utils/errors/ApplicationError";

export class UserDuplicateError extends ApplicationError {
    constructor() {
        super("Username already exist");
    }
}