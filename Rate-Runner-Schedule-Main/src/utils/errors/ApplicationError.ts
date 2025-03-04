export abstract class ApplicationError implements Error {
    constructor(message: string) {
        this.message = message;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, this.constructor.prototype);
    }
    name: string;
    message: string;
    stack?: string;
} 
