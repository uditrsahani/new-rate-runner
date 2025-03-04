import { Authorized, Body, ContentType, CurrentUser, Get, InternalServerError, JsonController, Param, Patch, Post, QueryParams, UseAfter } from "routing-controllers";
import { Inject, Service } from "typedi";
import { Forecast } from "../models/Forecast";
import { ForecastQueryParam } from "../models/ForecastQueryParam";
import { ForecastService } from "../services/ForecastService";
import { UserAccount } from "app/modules/auth/models/UserAccount";
import { LoggerMiddleware } from "app/utils/middlewares/LoggerMiddleware";

@Service()
@JsonController("/forecast")
export class ForecastController {

    @Inject(() => ForecastService)
    private forecastService: ForecastService;

    @Authorized()
    @Get("/")
    async getForecast(@CurrentUser() user: UserAccount,
                      @QueryParams() queryParam: ForecastQueryParam) {
        try{
            const forecast = await this.forecastService.getForecast(queryParam, user);
            return forecast;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/report/monthly_sales")
    async reportMonthlyForecast(@CurrentUser() user: UserAccount,
                                @QueryParams() queryParam: ForecastQueryParam) {
        try{
            const forecast = await this.forecastService.reportMonthlyForecast(queryParam, user);
            return forecast;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get("/export/monthly_sales")
    @ContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    async exportMonthlyForecast(@CurrentUser() user: UserAccount,
                                @QueryParams() queryParam: ForecastQueryParam) {
        try{
            const forecast = await this.forecastService.exportMonthlyForecast(queryParam, user);
            return forecast;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Post("/")
    @UseAfter(LoggerMiddleware)
    async addForecast(@Body() forecasts: Forecast[]) {
        try{
            const forecastAdd = await this.forecastService.addForecast(forecasts);
            return forecastAdd;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Patch("/:fc_uuid")
    @UseAfter(LoggerMiddleware)
    async updateForecast(@Param("fc_uuid") fc_uuid: string,
                         @Body() forecast: Forecast) {
        try{
            const forecastUpdate = await this.forecastService.updateForecast(fc_uuid, forecast);
            return forecastUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }
}
