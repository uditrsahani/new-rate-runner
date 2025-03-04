import { UserDuplicateError } from "app/modules/auth/errors/UserDuplicateError";
import { UserAccount } from "app/modules/auth/models/UserAccount";
import { UserAccountQueryParam } from "app/modules/auth/models/UserAccountQueryParam";
import { UserManagementService } from "app/modules/auth/services/UserManagementService";
import { LoggerMiddleware } from "app/utils/middlewares/LoggerMiddleware";
import { Authorized, Body, ContentType, CurrentUser, Get, InternalServerError, JsonController, Param, Patch, Post, QueryParams, UseAfter } from "routing-controllers";
import { Inject, Service } from "typedi";
import { AgentProfile } from "../models/AgentProfile";
import { AgentProfileQueryParam } from "../models/AgentProfileQueryParam";
import { CarrierProfile } from "../models/CarrierProfile";
import { Competitor } from "../models/CompetitorProfile";
import { CustomerProfile } from "../models/CustomerProfile";
import { CustomerProfileQueryParam } from "../models/CustomerProfileQueryParam";
import { ProfileService } from "../services/ProfileServices";

@Service()
@JsonController("/profile")
export class ProfileController {

    @Inject(() => UserManagementService)
    private userManagementService: UserManagementService;

    @Inject(() => ProfileService)
    private profileService: ProfileService;

    @Authorized()
    @Get('/sale')
    async getSaleAllProfile(@QueryParams() user_param: UserAccountQueryParam) {
        try{
            const sales = await this.userManagementService.getAllUser(user_param);
            return sales;
        }catch(error) {
            if (error instanceof UserDuplicateError) {
                throw new UserDuplicateError();
            } else {
                console.log(error);
                throw new InternalServerError("Something went wrong.");
            }
        }
    }

    @Authorized()
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @Get('/sale/export')
    async exportSaleAllProfile() {
        try{
            const excelSales = await this.profileService.exportSales();
            return excelSales;
        }catch(error) {
            if (error instanceof UserDuplicateError) {
                throw new UserDuplicateError();
            } else {
                console.log(error);
                throw new InternalServerError("Something went wrong.");
            }
        }
    }

    @Authorized()
    @Get('/sale/:sale_id')
    async getSaleProfile(@Param("sale_id") user_id: string) {
        try{
            const sale = await this.userManagementService.getUser(user_id);
            return sale;
        }catch(error) {
            if (error instanceof UserDuplicateError) {
                throw new UserDuplicateError();
            } else {
                console.log(error);
                throw new InternalServerError("Something went wrong.");
            }
        }
    }

    @Authorized()
    @Post('/sale')
    @UseAfter(LoggerMiddleware)
    async addSaleProfile(@Body() saleProfile: UserAccount) {
        try{
            const sale = await this.userManagementService.addUser(saleProfile);
            return sale;
        }catch(error) {
            if (error instanceof UserDuplicateError) {
                throw new UserDuplicateError();
            } else {
                console.log(error);
                throw new InternalServerError("Something went wrong.");
            }
        }
    }

    @Authorized()
    @Patch('/sale/:user_id')
    @UseAfter(LoggerMiddleware)
    async updateSaleProfile(@Param("user_id") user_id: string,
                            @Body() user: UserAccount) {
        try{
            const userUpdate = await this.userManagementService.updateUser(user_id, user);
            return userUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get('/agent')
    async getAgentProfile(@QueryParams() params: AgentProfileQueryParam) {
        try{
            const agent = await this.profileService.getAgent(params);
            return agent;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @Get('/agent/export')
    async exportAgentProfile(@QueryParams() params: AgentProfileQueryParam) {
        try{
            const excelAgent = await this.profileService.exportAgent(params);
            return excelAgent;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get('/agent/:agent_id')
    async getAgentProfileDetail(@Param("agent_id") agent_id: string,
                                @QueryParams() params: AgentProfileQueryParam) {
        try{
            params.agent_id = agent_id;
            const agent = await this.profileService.getAgent(params);
            return agent[0];
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Post('/agent')
    @UseAfter(LoggerMiddleware)
    async addAgentProfile(@Body() agent: AgentProfile) {
        try{
            const agent_id = await this.profileService.addAgent(agent);
            return agent_id;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Patch('/agent/:agent_id')
    @UseAfter(LoggerMiddleware)
    async updateAgentProfile(@Param("agent_id") agent_id: string,
                             @Body() agent: AgentProfile) {
        try{
            const agentUpdate = await this.profileService.updateAgent(agent_id, agent);
            return agentUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get('/carrier')
    async getCarrierProfile() {
        try{
            const carrier = await this.profileService.getCarrier();
            return carrier;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @Get('/carrier/export')
    async exportCarrierProfile() {
        try{
            const excelCarrier = await this.profileService.exportCarrier();
            return excelCarrier;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Post('/carrier')
    @UseAfter(LoggerMiddleware)
    async addCarrierProfile(@Body() carrier: CarrierProfile) {
        try{
            const cr_id = await this.profileService.addCarrier(carrier);
            return cr_id;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Patch('/carrier/:cr_id')
    @UseAfter(LoggerMiddleware)
    async updateCarrierProfile(@Param("cr_id") cr_id: string,
                               @Body() carrier: CarrierProfile) {
        try{
            const carrierUpdate = await this.profileService.updateCarrier(cr_id, carrier);
            return carrierUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get('/customer')
    async getCustomerProfile(@CurrentUser() user: UserAccount,
                             @QueryParams() queryParam?: CustomerProfileQueryParam) {
        try{
            const customer = await this.profileService.getCustomer(queryParam, user);
            return customer;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @Get('/customer/export')
    async exportCustomerProfile(@CurrentUser() user: UserAccount,
                                @QueryParams() queryParam?: CustomerProfileQueryParam) {
        try{
            const excelCustomer = await this.profileService.exportCustomer(queryParam, user);
            return excelCustomer;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get('/customer/owner')
    async getOwnerCustomer(@CurrentUser() user: UserAccount) {
        const customer = await this.profileService.getOwnerCustomer(user.user_id);
        return customer;
    }

    @Authorized()
    @Post('/customer')
    @UseAfter(LoggerMiddleware)
    async addCustomerProfile(@Body() customer: CustomerProfile) {
        try{
            const cus_id = await this.profileService.addCustomer(customer);
            return cus_id;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Patch('/customer/:cus_id')
    @UseAfter(LoggerMiddleware)
    async updateCustomerProfile(@Param("cus_id") cus_id: string,
                                @Body() customer: CustomerProfile) {
        try{
            const customerUpdate = await this.profileService.updateCustomer(cus_id, customer);
            return customerUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get('/competitor')
    async getCompetitorProfile() {
        try{
            const customer = await this.profileService.getCompetitor();
            return customer;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @Get('/competitor/export')
    async exportCompetitorProfile() {
        try{
            const excelCompetitor = await this.profileService.exportCompetitor();
            return excelCompetitor;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Post('/competitor')
    @UseAfter(LoggerMiddleware)
    async addCompetitorProfile(@Body() competitor: Competitor) {
        try{
            const ct_id = await this.profileService.addCompetitor(competitor);
            return ct_id;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Patch('/competitor/:ct_id')
    @UseAfter(LoggerMiddleware)
    async updateCompetitorProfile(@Param("ct_id") ct_id: string,
                                  @Body() competitor: Competitor) {
        try{
            const competitorUpdate = await this.profileService.updateCompetitor(ct_id, competitor);
            return competitorUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }
}
