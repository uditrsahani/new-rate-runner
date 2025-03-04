import { Token } from "typedi";
import { LogMail } from "../models/LogMail";

export interface ILogRepository {
    getLogmail(): Promise<LogMail[]>
    addLogMail(log: LogMail): Promise<any>
}

export const LogRepositoryToken = new Token<ILogRepository>();
