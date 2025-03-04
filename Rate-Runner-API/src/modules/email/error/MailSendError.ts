import { ApplicationError } from "app/utils/errors/ApplicationError";

export class MailSendError extends ApplicationError {
    constructor(message?: string) {
        super(message || "Send mail error");
    }
}