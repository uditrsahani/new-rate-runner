import { Inject, Service } from "typedi";
import { Transaction } from "../models/Transaction";
import { TransactionQueryParam } from "../models/TransactionQueryParam";
import { ITransactionRepository, TransactionRepositoryToken } from "../repositories/ITransactionRepository";

@Service()
export class TransactionService {
    @Inject(TransactionRepositoryToken)
    private transactionRepository: ITransactionRepository;

    async addTransasction(tran: Transaction) {
        const tranAdd = await this.transactionRepository.addTransasction(tran);
        return tranAdd;
    }

    async getTransasction(param: TransactionQueryParam) {
        const tran = await this.transactionRepository.getTransasction(param);
        return tran;
    }

    async getLeadTime() {
        const leadtime = await this.transactionRepository.getLeadTime();
        return leadtime;
    }
}
