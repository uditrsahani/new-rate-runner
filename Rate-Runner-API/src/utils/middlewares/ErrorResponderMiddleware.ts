import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from "routing-controllers";
import { Request, Response } from "express";
import { Service } from "typedi";

@Service()
@Middleware({
    type: "after"
})
export class ErrorResponderMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: HttpError | Error, request: Request, response: Response, next: (err?: any) => any): void {
        delete error.stack
        response.status((error instanceof HttpError) ? error.httpCode : 500);
        response.send({
            name: error.name,
            message: error.message,
            ...error
        });
    }
}