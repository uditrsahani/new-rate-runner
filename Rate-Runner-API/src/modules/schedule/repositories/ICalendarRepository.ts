import { Token } from "typedi";
import { Calendar } from "../models/Calendar";

export interface ICalendarRepository {
    getHoliday(): Promise<Calendar[]>
    addHoliday(car: Calendar): Promise<any>
    deleteHoliday(cd_id: string): Promise<any>
}

export const CalendarToken = new Token<ICalendarRepository>();
