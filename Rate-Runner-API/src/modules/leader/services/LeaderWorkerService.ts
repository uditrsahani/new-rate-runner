import { Inject, Service } from "typedi";
import { LeaderWorker } from "../models/LeaderWorker";
import { ILeaderWorkerRepository, LeaderWorkerToken } from "../repositories/ILeaderWorkerRepository";

@Service()
export class LeaderWorkerService {

    @Inject(LeaderWorkerToken)
    private leaderWorkerRepository: ILeaderWorkerRepository;

    async getLeaderWorker(caller_user_id: string) {
        const worker_cust = this.leaderWorkerRepository.getLeaderWorker(caller_user_id);
        return await worker_cust;
    }

    async addLeaderWorker(leader_worker: LeaderWorker) {
        const add_work = this.leaderWorkerRepository.addLeaderWorker(leader_worker);
        return add_work;
    }

    async delLeaderWorker(leader_worker: LeaderWorker) {
        const del_work = this.leaderWorkerRepository.delLeaderWorker(leader_worker)
        return await del_work;
    }
}
