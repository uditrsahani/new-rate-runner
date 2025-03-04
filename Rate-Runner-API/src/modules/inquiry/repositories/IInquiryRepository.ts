import { Token } from "typedi";
import { Inquiry } from "../models/Inquiry";
import { InquiryQueryParam } from "../models/InquiryQueryParam";
import { InquiryRate } from "../models/InquiryRate";
import { IquiryReportQueryParam } from "../models/InquiryReportQueryParam";

export interface IInquiryRepository {
    getInquiry(queryParam: InquiryQueryParam): Promise<Inquiry[]>
    getInquiryMinimize(queryParam: InquiryQueryParam): Promise<Inquiry[]>
    getInquiryDashboardStatus(queryParam: InquiryQueryParam): Promise<Inquiry[]>
    getInquiryReportTop(params: IquiryReportQueryParam): Promise<any[]>
    getInquiryReportSale(params: IquiryReportQueryParam): Promise<any>
    getInquiryReportActual(params: IquiryReportQueryParam): Promise<any>
    getInquiryReportKey(queryParam: IquiryReportQueryParam): Promise<any[]>
    getInquiryReportCustomer(queryParam: IquiryReportQueryParam): Promise<any>
    getInquiryReportTopCustomer(queryParam: IquiryReportQueryParam): Promise<any>
    getInquiryReportBooking(queryParam: IquiryReportQueryParam): Promise<any>
    getRateInquiry(queryParam: InquiryQueryParam): Promise<any>
    addRateInquiry(inqRate: InquiryRate[]): Promise<any>
    deleteRateInquiry(inq_uuid: string, inq_rate: InquiryRate): Promise<any>
    addInquiry(inq: Inquiry): Promise<any>
    updateInquiry(inq_uuid: string, inq: Inquiry): Promise<any>
    updateStatusInquiry(inq_uuid: string, inq_status: string): Promise<any>
    updateQtnStatusInquiry(inq_uuid: string, inq_qtn: string): Promise<any>
}

export const InquiryRepositoryToken = new Token<IInquiryRepository>();
