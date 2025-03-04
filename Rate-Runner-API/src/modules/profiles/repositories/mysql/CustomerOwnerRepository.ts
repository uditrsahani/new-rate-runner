import { MysqlRepository } from "app/core/MysqlRepository";
import { UserAccount } from "app/modules/auth/models/UserAccount";
import { Service } from "typedi";
import { CustomerProfile } from "../../models/CustomerProfile";
import { CustomerOwnerToken, ICustomerOwnerRepository } from "../ICustomerOwnerRepository";

@Service()
@Service(CustomerOwnerToken)
export class CustomerOwnerRepository extends MysqlRepository<CustomerProfile> implements ICustomerOwnerRepository {
    public tableName: string = "customer";
    
    async getUserOwnerTeam(user: UserAccount) {
        const cust_worker_team = this.getQueryBuilder()
        .select("customer.cus_id")
        .leftJoin("user", "user.user_id", "user_owner.user_id")
        .leftJoin("customer", "customer.cus_id", "leader_worker.worker_user_id")

        return await cust_worker_team;
    }

    async getUserOwnerWorker(caller_user_id: string) {
        const cust_worker = this.getQueryBuilder()
        .select("customer.cus_id")
        .leftJoin("user_owner", "user_owner.cus_id", "customer.cus_id")
        .leftJoin("user", "user.user_id", "user_owner.user_id")
        .leftJoin("leader_worker", "leader_worker.worker_user_id", "user.user_id")
        .where("leader_worker.leader_user_id", caller_user_id)

        return await cust_worker;
    }

    async getSaleCustOwner(user_id: string) {
        const cust_id = await this.getQueryBuilder()
            .select("user_owner.cus_id")
            .from("user_owner")
            .where("user_owner.user_id", user_id)
            .groupBy("user_owner.cus_id")
        return cust_id;
    }

    async addUserOwner() {

    }

    async deleteUserOwner() {

    }
}
