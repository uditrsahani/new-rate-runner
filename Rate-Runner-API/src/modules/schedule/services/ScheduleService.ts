import { UserAccount } from "app/modules/auth/models/UserAccount";
import { Inquiry } from "app/modules/inquiry/models/Inquiry";
import { InquiryQueryParam } from "app/modules/inquiry/models/InquiryQueryParam";
import { InquiryRepositoryToken, IInquiryRepository } from "app/modules/inquiry/repositories/IInquiryRepository";
import { InquiryService } from "app/modules/inquiry/services/InquiryService";
import moment from "moment";
import { Inject, Service } from "typedi";
import { Calendar } from "../models/Calendar";
import { CalendarToken, ICalendarRepository} from "../repositories/ICalendarRepository";
import { v4 as uuidv4 } from "uuid";

@Service()
export class ScheduleService {

    @Inject(() => InquiryService)
    private inquiryService: InquiryService;

    @Inject(InquiryRepositoryToken)
    private inquiryRepository: IInquiryRepository;

    @Inject(CalendarToken)
    private calendarRepository: ICalendarRepository;

    async updateInquiryLeadTime(user: UserAccount) {
        const inqParam = new InquiryQueryParam();
        const inquiry = await this.inquiryService.getInquiry(inqParam, user);
        const holidays: Calendar[] = await this.calendarRepository.getHoliday();
        const inqToUpdate: Inquiry[] = [];
        const now = moment().utcOffset(7);

        for(let i = 0; i < holidays.length; i++){
            const day = now.date();
            const month = Number(now.format("MM"));

            if(day === holidays[i].cd_date && month === holidays[i].cd_month) {
                return "Today is holiday"
            }
        }

        if(now.format("ddd") !== "Sat" && now.format("ddd") !== "Sun") {
            inquiry.forEach((inq) => {
                if(inq.inq_status !== 'close') {
                    switch(inq.inq_status) {
                        case "waiting sales": {
                            let days: number = inq.inq_waiting_sales;
                            if(!days) { days = 0; }
                            const inqNewDate = new Inquiry();
                            inqNewDate.inq_uuid = inq.inq_uuid;
                            inqNewDate.inq_waiting_sales = ++days;
                            inqToUpdate.push(inqNewDate);
                            break;
                        }
                        case "waiting marketing": {
                            let days: number = inq.inq_waiting_mktg;
                            if(!days) { days = 0; }
                            const inqNewDate = new Inquiry();
                            inqNewDate.inq_uuid = inq.inq_uuid;
                            inqNewDate.inq_waiting_mktg = ++days;
                            inqToUpdate.push(inqNewDate);
                            break;
                        }
                        case "waiting customer": {
                            let days: number = inq.inq_waiting_cus;
                            if(!days) { days = 0; }
                            const inqNewDate = new Inquiry();
                            inqNewDate.inq_uuid = inq.inq_uuid;
                            inqNewDate.inq_waiting_cus = ++days;
                            inqToUpdate.push(inqNewDate);
                            break;
                        }
                        case "waiting quotation": {
                            let days: number = inq.inq_waiting_quotation;
                            if(!days) { days = 0; }
                            const inqNewDate = new Inquiry();
                            inqNewDate.inq_uuid = inq.inq_uuid;
                            inqNewDate.inq_waiting_quotation = ++days;
                            inqToUpdate.push(inqNewDate);
                            break;
                        }
                        default: {
                            console.log(inq.inq_no, "Not in case")
                        }
                    }
                }
            });
    
            inqToUpdate.forEach(async (inq: Inquiry) => {
                await this.inquiryRepository.updateInquiry(inq.inq_uuid, inq);
            });

            return "Inquiry schedule updated";
        } else {
            return "Sat or Sun holiday"
        } 
    }

    async getHoliday() {
        const holiday = await this.calendarRepository.getHoliday();
        return holiday;
    }

    async addHoliday(car: Calendar) {
        car.cd_id = uuidv4();
        const holiday = await this.calendarRepository.addHoliday(car);
        return holiday;
    }

    async deleteHoliday(cd_id: string) {
        const holiday = await this.calendarRepository.deleteHoliday(cd_id);
        return holiday;
    }
}
