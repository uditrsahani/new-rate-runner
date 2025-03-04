import { MysqlRepository } from "app/core/MysqlRepository";
import { Service } from "typedi";
import { UserDuplicateError } from "../../errors/UserDuplicateError";
import { UserAccount } from "../../models/UserAccount";
import { IUserRepository, UserRepository } from "../IUserRepository";

import { UserAccountQueryParam } from "../../models/UserAccountQueryParam";
import { UserOwner } from "../../models/UserOwner";

@Service()
@Service(UserRepository)
export class UserPgRepository extends MysqlRepository<UserAccount> implements IUserRepository {
    public tableName: string = "user";

    async getUser(user_param: UserAccountQueryParam) {
        const qc = this.getQueryBuilder<UserAccount>();

        if(user_param.user_id) {
            qc.where("user_id", user_param.user_id);
        }

        if(user_param.user_mail) {
            qc.where("user_mail", user_param.user_mail);
        }

        if(user_param.user_role) {
            qc.where("user_role", user_param.user_role);
        }

        if(user_param.user_team) {
            qc.where("user_team", user_param.user_team);
        }

        const user = await qc
            .first();

        delete user.user_password;
        delete user.user_password_hash;

        return user;
    }

    async getTeam(user_team: string, user_id: string) {
        const user = await this.getQueryBuilder()
            .select("team.user_id")
            .select("team.user_username")
            .select("team.user_mail")
            .select("team.user_role")
            .select("team.user_fullname")
            .select("team.user_phone")
            .select("team.user_mobile")
            .select("team.user_team")
            .leftJoin("leader_worker", "leader_worker.leader_user_id", "user.user_id")
            .leftJoin({ team: "user" }, "leader_worker.worker_user_id", "team.user_id")
            .where("team.user_team", user_team)
            .andWhere("leader_worker.leader_user_id", user_id)

        return user;
    }

    async addUserOwner(user_owners: UserOwner[]) {
        const owner_insert: any[] = [];
        user_owners.forEach((user_owner: UserOwner) => {
            owner_insert.push({
                user_id: user_owner.user_id,
                cus_id: user_owner.cus_id
            });
        });

        const user_owner = this.getQueryBuilder("user_owner")
            .insert(owner_insert)
            .onConflict(['user_id', 'cus_id'])
            .merge();

        return await user_owner;
    }

    async deleteUserOwner(user_owners: UserOwner[]) {
        const delete_id: string[][] = [];
        user_owners.forEach((user_owner: UserOwner) => {
            delete_id.push([
                user_owner.user_id,
                user_owner.cus_id
            ]);
        });

        const user_owner_delete = this.getQueryBuilder("user_owner")
            .del()
            .whereIn(["user_owner.user_id", "user_owner.cus_id"], delete_id);

        return await user_owner_delete;
    }

    async getUserOwner(cus_id: string, user_id?: string) {

        const user_owner = this.getQueryBuilder("user_owner")

        if(user_id) {
            user_owner.andWhere("user_owner.user_id", user_id);
        }

        user_owner
            .select("user_owner.user_id")
            .select("user.user_fullname")
            .select("user.user_team")
            .select("user.user_role")
            .leftJoin("user", "user.user_id", "user_owner.user_id")
            .where("user_owner.cus_id", cus_id)

        return await user_owner;
    }

    async getRawCustOwner(user_id: string[]) {
        const user_owner = this.getQueryBuilder("user_owner")

        if(user_id) {
            user_owner.whereIn("user_owner.user_id", user_id);
        }

        user_owner
            .select("user_owner.cus_id")
            .groupBy("user_owner.cus_id")

        return await user_owner;
    }

    async getUserCustOwner(user_id: string) {
        const cust_id = await this.getQueryBuilder()
            .select("user_owner.cus_id")
            .leftJoin("user_owner", "user_owner.user_id", "user.user_id")
            .where("user.user_id", user_id)
            .groupBy("user_owner.cus_id")
        return cust_id;
    }

    async getAllUser(user_param: UserAccountQueryParam) {
        const qc = this.getQueryBuilder<UserAccount[]>();

        if(user_param.user_role) {
            qc.where("user_role", user_param.user_role);
        }

        if(user_param.user_roles) {
            qc.whereIn("user_role", user_param.user_roles);
        }

        if(user_param.user_team) {
            qc.where("user_team", user_param.user_team);
        }

        if(user_param.user_id) {
            qc.where("user_id", user_param.user_id);
        }

        if(user_param.user_mail) {
            qc.where("user_mail", user_param.user_mail);
        }

        const users = await qc
            .select("*");

        users.map((user) => { 
            delete user.user_password;
            delete user.user_password_hash;
            return user;
        });

        return users;
    }

    async addUser(user: UserAccount) {
        const find_user = await this.first((qr) => qr.where("user_username", user.user_username));
        if (find_user) {
            throw new UserDuplicateError();
        }

        const entity = await this.insert([user]);
        return entity;
    }

    async updateUser(user_id: string, sale: UserAccount) {
        const userUpdate = await this.getQueryBuilder<UserAccount>()
            .update(sale)
            .where("user_id", user_id)
        return userUpdate;
    }
}
