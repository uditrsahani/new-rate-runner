import { ApplicationError } from "app/utils/errors/ApplicationError";

export class UserNotFoundError extends ApplicationError {
    constructor(msg: string = "User not found." ) {
        super(msg);
    }
}