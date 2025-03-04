import { IsOptional } from "class-validator"

export class CityTable {
    cc_city_id: string
    cc_country_id: string
    cc_city_name: string
    cc_country_name: string
    @IsOptional()
    cc_trade: string
    @IsOptional()
    cc_disable: number
}
