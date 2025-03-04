import { Token } from "typedi";
import { Forecast } from "../models/Forecast";
import { ForecastQueryParam } from "../models/ForecastQueryParam";

export interface IForecastRepository {
    getForecast(queryParam: ForecastQueryParam): Promise<Forecast[]>
    addForecast(forecast: Forecast[]): Promise<any>
    updateForecast(fc_no: string, forecast: Forecast): Promise<any>
}

export const ForecastRepositoryToken = new Token<IForecastRepository>();
