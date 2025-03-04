import { Token } from "typedi";
import { TatTable } from "../models/TatTable";

export interface ITATTableRepository {
    getTat(): Promise<TatTable>
    updateTat(tat: TatTable): Promise<any>
}

export const TATTableRepositoryToken = new Token<ITATTableRepository>();
