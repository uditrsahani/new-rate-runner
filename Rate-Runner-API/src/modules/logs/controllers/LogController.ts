import { UserAccount } from "app/modules/auth/models/UserAccount";
import { LoggerMiddleware } from "app/utils/middlewares/LoggerMiddleware";
import { Authorized, Body, CurrentUser, Get, HeaderParam, InternalServerError, JsonController, Post, UseAfter } from "routing-controllers";
import { Inject, Service } from "typedi";
import { LogMail } from "../models/LogMail";
import { LogService } from "../services/LogService";

@Service()
@JsonController('/log')
export class LogController {

    @Inject(() => LogService)
    private logService: LogService;

    @Authorized()
    @Get('/mail')
    async getLogmail() {
        try{
            const log = await this.logService.getLogmail();
            return log;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Post('/mail')
    @UseAfter(LoggerMiddleware)
    async addLogMail(@HeaderParam("authorization", { required: true }) token: string,
                     @Body() log: LogMail,
                     @CurrentUser() user: UserAccount) {
        const logAdd = await this.logService.addLogMail(log, token, user);
        return logAdd;
    }

    @Authorized()
    @Post('/mail/raw')
    @UseAfter(LoggerMiddleware)
    async addLogMailRaw(@HeaderParam("authorization", { required: true }) token: string,
                        @Body() log: LogMail,
                        @CurrentUser() user: UserAccount) {
        const logAdd = await this.logService.addRawLogMail(log, token, user);
        return logAdd;
    }
}
