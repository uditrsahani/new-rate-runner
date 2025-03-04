import { UserAccount } from "app/modules/auth/models/UserAccount";
import { Body, Get, InternalServerError, JsonController, Param, Patch, Post } from "routing-controllers";
import { Inject, Service } from "typedi";
import { Calendar } from "../models/Calendar";
import { ScheduleService } from "../services/ScheduleService";

@Service()
@JsonController("/schedule")
export class ScheduleController {

    @Inject(() => ScheduleService)
    private scheduleService: ScheduleService;

    @Post("/")
    async updateInqLeadtimeSchedule() {
        try{
            const user: UserAccount = new UserAccount();
            user.user_role = "systemAdmin";
            const schedule = await this.scheduleService.updateInquiryLeadTime(user);
            return schedule;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Get("/holiday")
    async getHoliday() {
        try{
            const holiday = await this.scheduleService.getHoliday();
            return holiday;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Post("/holiday")
    async addHoliday(@Body() car: Calendar) {
        try{
            const holiday = await this.scheduleService.addHoliday(car);
            return holiday;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Patch("/holiday/:car_id")
    async deleteHoliday(@Param("car_id") car_id: string) {
        try{
            const holiday = await this.scheduleService.deleteHoliday(car_id);
            return holiday;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }
}
