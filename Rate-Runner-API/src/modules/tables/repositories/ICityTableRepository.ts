import { Token } from "typedi";
import { CityTable } from "../models/CityTable";

export interface ICityTableRepository {
    getCityTable(param? : CityTable): Promise<CityTable[]>;
    addCityTable(city: CityTable): Promise<any>;
    updateCity(city_id: string, country_id: string, city: CityTable): Promise<any>;
}

export const CityTableRepositoryToken = new Token<ICityTableRepository>();
