import { MysqlRepository } from "app/core/MysqlRepository";
import { Service } from "typedi";
import { LeaderWorker } from "../../models/LeaderWorker";
import { ILeaderWorkerRepository, LeaderWorkerToken } from "../ILeaderWorkerRepository";

@Service()
@Service(LeaderWorkerToken)
export class LeaderWorkerRepository extends MysqlRepository<LeaderWorker> implements ILeaderWorkerRepository {
    public tableName: string = "leader_worker";

    async getLeaderWorker(caller_user_id: string) {
        const worker_cust = this.getQueryBuilder()
            .select("*")
            .where("leader_user_id", caller_user_id);

        return await worker_cust;
    }

    async addLeaderWorker(leader_worker: LeaderWorker) {
        const add_work = this.getQueryBuilder()
            .insert(leader_worker)

        return add_work;
    }

    async delLeaderWorker(leader_worker: LeaderWorker) {
        const del_work = this.getQueryBuilder()
            .del()
            .where("leader_user_id", leader_worker.leader_user_id)
            .andWhere("worker_user_id", leader_worker.worker_user_id);

        return await del_work;
    }
}
