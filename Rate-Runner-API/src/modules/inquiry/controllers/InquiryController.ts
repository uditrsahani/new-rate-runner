import { UserAccount } from "app/modules/auth/models/UserAccount";
import { LoggerMiddleware } from "app/utils/middlewares/LoggerMiddleware";
import console from "console";
import { Authorized, Body, ContentType, CurrentUser, Get, InternalServerError, JsonController, NotAcceptableError, Param, Patch, Post, QueryParam, QueryParams, UseAfter } from "routing-controllers";
import { Inject, Service } from "typedi";
import { Inquiry } from "../models/Inquiry";
import { InquiryQueryParam } from "../models/InquiryQueryParam";
import { InquiryRate } from "../models/InquiryRate";
import { IquiryReportQueryParam } from "../models/InquiryReportQueryParam";
import { InquiryService } from "../services/InquiryService";

@Service()
@JsonController("/inquiry")
export class InquiryController {

    @Inject(() => InquiryService)
    private inquiryService: InquiryService;

    @Authorized()
    @Get("/")
    async getInquiry(@CurrentUser() user: UserAccount,
                     @QueryParams() queryParam: InquiryQueryParam) {
        try{     
            const inq = await this.inquiryService.getInquiry(queryParam, user);
            return inq;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/export/performance")
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    async exportInquiryReportPerformance(@CurrentUser() user: UserAccount,
                                         @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const excel = await this.inquiryService.exportInquiryReportPerformance(queryParam, user);
            return excel;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/report/top")
    async getInquiryReport(@CurrentUser() user: UserAccount,
                           @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const inqReport = await this.inquiryService.getInquiryReportTop(queryParam, user);
            return inqReport;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/export/top")
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    async exportInquiryReportTop(@CurrentUser() user: UserAccount,
                                 @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const excel = await this.inquiryService.exportInquiryReportTop(queryParam, user);
            return excel;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/report/sale")
    async getInquiryReportSale(@CurrentUser() user: UserAccount,
                               @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const inqReportSale = await this.inquiryService.getInquiryReportSale(queryParam, user);
            return inqReportSale;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/export/sale")
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    async exportInquiryReportSale(@CurrentUser() user: UserAccount,
                                  @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const excel = await this.inquiryService.exportInquiryReportSale(queryParam, user);
            return excel;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/report/actual")
    async getInquiryReportActual(@CurrentUser() user: UserAccount,
                                 @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const inqReportSale = await this.inquiryService.getInquiryReportActual(queryParam, user);
            return inqReportSale;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/export/actual")
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    async exportInquiryReportActual(@CurrentUser() user: UserAccount,
                                    @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const excel = await this.inquiryService.exportInquiryReportActual(queryParam, user);
            return excel;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/report/key")
    async getInquiryReportKey(@CurrentUser() user: UserAccount,
                              @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const inqReportKey = await this.inquiryService.getInquiryReportKey(queryParam, user);
            return inqReportKey;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/export/key")
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    async exportInquiryReportKey(@CurrentUser() user: UserAccount,
                                 @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const inqReportKey = await this.inquiryService.exportInquiryReportKey(queryParam, user);
            return inqReportKey;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/report/customer")
    async getInquiryReportCustomer(@CurrentUser() user: UserAccount,
                                   @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const inqReportCustomer = await this.inquiryService.getInquiryReportCustomer(queryParam, user);
            return inqReportCustomer;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/export/customer")
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    async exprtInquiryReportCustomer(@CurrentUser() user: UserAccount,
                                     @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const inqReportCustomer = await this.inquiryService.exportInquiryReportCustomer(queryParam, user);
            return inqReportCustomer;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/report/top_customer")
    async getInquiryReportTopCustomer(@CurrentUser() user: UserAccount,
                                      @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const inqReportTopCustomer = await this.inquiryService.getInquiryReportTopCustomer(queryParam, user);
            return inqReportTopCustomer;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/export/top_customer")
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    async exportInquiryReportTopCustomer(@CurrentUser() user: UserAccount,
                                        @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const inqReportTopCustomer = await this.inquiryService.exportInquiryReportTopCustomer(queryParam, user);
            return inqReportTopCustomer;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/report/booking")
    async getInquiryReportBooking(@CurrentUser() user: UserAccount,
                                  @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const inqReportBooking = await this.inquiryService.getInquiryReportBooking(queryParam, user);
            return inqReportBooking;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/export/booking")
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    async exportInquiryReportBooking(@CurrentUser() user: UserAccount,
                                     @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            const inqReportBooking = await this.inquiryService.exportInquiryReportBooking(queryParam, user);
            return inqReportBooking;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/:inq_uuid")
    async getInquiryDetail(@Param("inq_uuid") inq_uuid: string,
                           @CurrentUser() user: UserAccount,
                           @QueryParams() queryParam: IquiryReportQueryParam) {
        try{
            queryParam.inq_uuid = inq_uuid;
            const inqAdd = await this.inquiryService.getInquiry(queryParam, user);
            return inqAdd[0];
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/:inq_uuid/rate")
    async getRateInquiry(@Param("inq_uuid") inq_uuid: string,
                         @QueryParam("rate_recommend") rate_recommend: string) { 
        try{
            const queryParam = new InquiryQueryParam();
            queryParam.inq_uuid = inq_uuid;
            queryParam.rate_recommend = rate_recommend;
            const inqRate = await this.inquiryService.getRateInquiry(queryParam);
            return inqRate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Post("/:inq_uuid/rate")
    @UseAfter(LoggerMiddleware)
    async addRateInquiry(@Param("inq_uuid") inq_uuid: string,
                         @Body() inq_rate: InquiryRate) { 
        try{
            const inqRate = await this.inquiryService.addRateInquiry(inq_uuid, inq_rate);
            return inqRate;
        }catch(error) {
            console.log(error); 
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Patch("/:inq_uuid/rate")
    @UseAfter(LoggerMiddleware)
    async deleteRateInquiry(@Param("inq_uuid") inq_uuid: string,
                            @Body() inq_rate: InquiryRate) { 
        try{
            const inqRate = await this.inquiryService.deleteRateInquiry(inq_uuid, inq_rate);
            return inqRate;
        }catch(error) {
            if(error instanceof NotAcceptableError) {
                console.log(error.message);
                throw new NotAcceptableError("rate_id is null");
            }
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Post("/")
    @UseAfter(LoggerMiddleware)
    async addInquiry(@Body() inq: Inquiry) {
        try{
            const inqAdd = await this.inquiryService.addInquiry(inq);
            return inqAdd;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Patch("/:inq_uuid")
    @UseAfter(LoggerMiddleware)
    async updateInquiry(@Param("inq_uuid") inq_uuid: string,
                        @Body() inq: Inquiry) {
        try{
            const inqUpdate = await this.inquiryService.updateInquiry(inq_uuid, inq);
            return inqUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Patch("/:inq_uuid/inq_status/:inq_status")
    @UseAfter(LoggerMiddleware)
    async updateStatusInquiry(@Param("inq_uuid") inq_uuid: string,
                              @Param("inq_status") inq_status: string) {
        try{
            const inqUpdate = await this.inquiryService.updateStatusInquiry(inq_uuid, inq_status);
            return inqUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Patch("/:inq_uuid/inq_qtn/:inq_qtn")
    @UseAfter(LoggerMiddleware)
    async updateQtnStatusInquiry(@Param("inq_uuid") inq_uuid: string,
                                 @Param("inq_qtn") inq_qtn: string) {
        try{
            const inqUpdate = await this.inquiryService.updateQtnStatusInquiry(inq_uuid, inq_qtn);
            return inqUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }
}
