import { UserAccount } from "app/modules/auth/models/UserAccount";
import { Token } from "typedi";
import { RateTable } from "../models/RateTable";
import { RateTableQueryParam } from "../models/RateTableQueryParam";

export interface IRateTableRepository {
    addRateTable(rate: RateTable[]): Promise<any>;
    getRateTableByNo(input_no: string[]): Promise<Pick<RateTable, "rate_input_no">[]>
    getRateTable(queryParam: RateTableQueryParam): Promise<RateTable[]>
    exportRateTable(queryParam: RateTableQueryParam): Promise<RateTable[]>
    updateRateTable(rate_id: string, rateDetail: RateTable): Promise<any>;
    disableRateTable(rate_id: string, disable: number): Promise<any>;
    updateRateLog(rate_id: string, rateDetail: RateTable, user: UserAccount): Promise<any>;
}

export const RateTableRepositoryToken = new Token<IRateTableRepository>();
