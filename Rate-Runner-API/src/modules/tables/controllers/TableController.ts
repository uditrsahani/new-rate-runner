import { Authorized, Body, ContentType, CurrentUser, Get, InternalServerError, JsonController, Param, Params, Patch, Post, QueryParams, UploadedFile, UploadOptions, UseAfter } from "routing-controllers";
import { Inject, Service } from "typedi";
import { TableService } from "../services/TableServices";
import "multer";
import { RateTable } from "../models/RateTable";
import { fileUploadOptions } from "app/utils/MulterConfig";
import { CityTable } from "../models/CityTable";
import { PortTable } from "../models/PortTable";
import { TatTable } from "../models/TatTable";
import { RateTableQueryParam } from "../models/RateTableQueryParam";
import { UserAccount } from "app/modules/auth/models/UserAccount";
import { LoggerMiddleware } from "app/utils/middlewares/LoggerMiddleware";

const multerOption: UploadOptions = { options: fileUploadOptions }

@Service()
@JsonController("/table")
export class TableController {

    @Inject(() => TableService)
    private tableService: TableService;

    @Authorized()
    @UseAfter(LoggerMiddleware)
    @Post("/rate")
    async addRateTable(@Body() rate: RateTable) {
        const rateAdd = await this.tableService.addRateTable(rate);
        return rateAdd;
    }

    @Authorized()
    @UseAfter(LoggerMiddleware)
    @Post("/rate/file")
    async addFileRateTable(@CurrentUser() user: UserAccount,
                           @UploadedFile("file", multerOption.options) file: Express.Multer.File) {
        try{
            const rate = await this.tableService.addFileRateTable(file, user);
            return rate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/rate")
    async getRateTable(@QueryParams() queryParam: RateTableQueryParam) {
        try{
            const rate = await this.tableService.getRateTable(queryParam);
            return rate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/rate/export")
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    async getExportRateTable(@QueryParams() queryParam: RateTableQueryParam) {
        try{
            const rate = await this.tableService.getExportRateTable(queryParam);
            return rate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @UseAfter(LoggerMiddleware)
    @Patch("/rate/:rate_id")
    async updateRateTable(@Param("rate_id") rate_id: string,
                          @Body() rateDetail: RateTable,
                          @CurrentUser() user: UserAccount) {
        try{
            const updateRate = await this.tableService.updateRateTable(rate_id, rateDetail, user);
            return updateRate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @UseAfter(LoggerMiddleware)
    @Patch("/rate/:rate_id/disable/:disable")
    async disableRateTable(@Param("rate_id") rate_id: string,
                           @Param("disable") disable: number) {
        try{
            const rateDisable = await this.tableService.disableRateTable(rate_id, disable);
            return rateDisable;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/city")
    async getCity() {
        try{
            const city = await this.tableService.getCity();
            return city;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @Get("/city/export")
    async getExportCity() {
        try{
            const cityExcel = await this.tableService.exportCity();
            return cityExcel;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @UseAfter(LoggerMiddleware)
    @Post("/city")
    async addCity(@Body() city: CityTable) {
        try{
            const cityAdd = await this.tableService.addCity(city);
            return cityAdd;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @UseAfter(LoggerMiddleware)
    @Patch("/city/:city_id/country/:country_id")
    async updateCity(@Param("city_id") city_id: string,
                     @Param("country_id") country_id: string,
                     @Body() city: CityTable) {
        try{
            const cityUpdate = await this.tableService.updateCity(city_id, country_id, city);
            return cityUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/port")
    async getPort(@QueryParams() param: PortTable) {
        try{
            const port = await this.tableService.getPort(param);
            return port;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @Get("/port/export")
    async getExportPort() {
        try{
            const portExcel = await this.tableService.exportPort();
            return portExcel;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @UseAfter(LoggerMiddleware)
    @Post("/port")
    async addPort(@Body() port: PortTable) {
        try{
            const addPort = await this.tableService.addPort(port);
            return addPort;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @UseAfter(LoggerMiddleware)
    @Patch("/port/:port_id")
    async updatePort(@Param("port_id") port_id: string, 
                     @Body() port: PortTable) {
        try{
            const portUpdate = await this.tableService.updatePort(port_id, port);
            return portUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }
    
    @Authorized()
    @Get("/tat")
    async getTat() {
        try{
            const tat = await this.tableService.getTat();
            return tat;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @UseAfter(LoggerMiddleware)
    @Patch("/tat")
    async updateTat(@Body() tat: TatTable) {
        try{
            const tatUpdate = await this.tableService.updateTat(tat);
            return tatUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }
}
