import { UserAccount } from "app/modules/auth/models/UserAccount";
import { LoggerMiddleware } from "app/utils/middlewares/LoggerMiddleware";
import { Authorized, Body, CurrentUser, Delete, Get, InternalServerError, JsonController, Post, UseAfter } from "routing-controllers";
import { Inject, Service } from "typedi";
import { LeaderWorker } from "../models/LeaderWorker";
import { LeaderWorkerService } from "../services/LeaderWorkerService";

@Service()
@JsonController("/leader")
export class LeaderWorkerController {

    @Inject(() => LeaderWorkerService)
    private leaderWorkerService: LeaderWorkerService;

    @Authorized()
    @Get("/worker")
    async getLeaderWorker(@CurrentUser() user: UserAccount) {
        try{
            const worker = await this.leaderWorkerService.getLeaderWorker(user.user_id);
            return worker;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Post("/worker")
    @Authorized()
    @UseAfter(LoggerMiddleware)
    async addLeaderWorker(@Body() worker: LeaderWorker) {
        try{
            const add_worker = await this.leaderWorkerService.addLeaderWorker(worker);
            return add_worker;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Delete("/worker")
    @Authorized()
    @UseAfter(LoggerMiddleware)
    async delLeaderWorker(@Body() worker: LeaderWorker) {
        try{
            const del_worker = await this.leaderWorkerService.delLeaderWorker(worker);
            return del_worker;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }
}
