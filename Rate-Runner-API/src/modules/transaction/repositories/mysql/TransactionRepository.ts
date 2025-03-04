import { MysqlRepository } from "app/core/MysqlRepository";
import { Service } from "typedi";
import { Transaction } from "../../models/Transaction";
import { TransactionQueryParam } from "../../models/TransactionQueryParam";
import { ITransactionRepository, TransactionRepositoryToken } from "../ITransactionRepository";

@Service()
@Service(TransactionRepositoryToken)
export class TransactionRepository extends MysqlRepository<Transaction> implements ITransactionRepository {
    public tableName: string = "transaction";
    
    async addTransasction(tran: Transaction) {
        const tranAdd = await this.getQueryBuilder()
            .insert([tran]);
        return tranAdd;
    }

    async getTransasction(param: TransactionQueryParam) {
        const tran = await this.getQueryBuilder()
            .select("*");
        return tran;
    }

    async getLeadTime() {
        const leadtime = await this.getQueryBuilder("lead_time")
            .select("*")
            .first();
        return leadtime;
    }
}
