import { LogManager } from "app/core/Logger";
import { Request, Response } from "express";
import moment from "moment";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";

@Service()
export class LoggerMiddleware implements ExpressMiddlewareInterface {
    use(request: Request, response: Response, next: (err?: any) => any) {
        const logger = LogManager.instance.logger;
        let datetime = moment().utcOffset(7).format('YYYY-MM-DD HH:mm:ss');
        let method = request.method;
        let url = request.url;
        //let user: UserAccount = <any>request.headers.user_authorization;
        //let log = `${datetime},${method}:${url},${user.user_username}`;
        //logger.log("info", log);
    }
}
