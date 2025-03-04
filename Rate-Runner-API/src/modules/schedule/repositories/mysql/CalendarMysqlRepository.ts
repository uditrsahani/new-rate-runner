import { MysqlRepository } from "app/core/MysqlRepository";
import { Service } from "typedi";
import { Calendar } from "../../models/Calendar";
import { CalendarToken, ICalendarRepository } from "../ICalendarRepository";

@Service()
@Service(CalendarToken)
export class CalendarMysqlRepository extends MysqlRepository<Calendar> implements ICalendarRepository {
    public tableName: string = "calendar";

    async getHoliday(): Promise<Calendar[]> {
        const Calendar = this.getQueryBuilder()
            .select("*");
        return await Calendar;
    }

    async addHoliday(car: Calendar): Promise<any> {
        const Calendar = await this.getQueryBuilder()
            .insert(car);
        return Calendar;
    }

    async deleteHoliday(cd_id: string): Promise<any> {
        const Calendar = await this.getQueryBuilder()
            .del()
            .where("cd_id", cd_id);
        return Calendar;
    }

}
