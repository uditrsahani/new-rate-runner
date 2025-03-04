import { Token } from "typedi";
import { LeadTime } from "../models/LeadTime";
import { Transaction } from "../models/Transaction";
import { TransactionQueryParam } from "../models/TransactionQueryParam";

export interface ITransactionRepository {
    addTransasction(tran: Transaction): Promise<any>
    getTransasction(param: TransactionQueryParam): Promise<Transaction[]>
    getLeadTime(): Promise<LeadTime>
}

export const TransactionRepositoryToken = new Token<ITransactionRepository>();
