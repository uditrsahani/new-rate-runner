import { DatabaseRepository } from "app/core/sql";
import moment from "moment";
import { UnauthorizedError } from "routing-controllers";
import { Service } from "typedi";
import { UserAccount } from "../../models/UserAccount";
import { AuthenticationResult } from "../../utils/AuthenticationResult";
import { AuthenticationRepositoryToken, IAuthenticationRepository } from "../IAuthenticationRepository";

@Service()
@Service(AuthenticationRepositoryToken)
export class AuthenticationRepository extends DatabaseRepository<UserAccount> implements IAuthenticationRepository{
    public tableName: string = "token";

    async login(username: string): Promise<AuthenticationResult> {
        const user: AuthenticationResult = await this.executeQuery(query => query
            .select("user_id",
                    "user_username",
                    "user_mail",
                    "user_role",
                    "user_fullname",
                    "user_phone",
                    "user_mobile",
                    "user_team")
            .select("user_password_hash")
            .from("user")
            .where("user_username", username)
            .andWhere("user_disable", false)
            .first());

        return user;
    }

    async azureLogin(username: string): Promise<AuthenticationResult> {
        const user: AuthenticationResult = await this.executeQuery(query => query
            .select("user_id",
                    "user_username",
                    "user_mail",
                    "user_role",
                    "user_fullname",
                    "user_phone",
                    "user_mobile",
                    "user_team")
            .from("user")
            .where("user_mail", username)
            .andWhere("user_disable", false)
            .first());

        return user;
    }

    async clearExpiredToken() {
        const execute = await this.delete(qc => qc.where("expire_at","<", moment().unix()));
        return execute;
    }

    async invokeToken(token: string, user_id: string): Promise<void> {
        const response = await this.insert([{
            token: token,
            user_id: user_id,
            expire_at: moment().add(60 * 12, "minutes").unix(),
            register_timestamp: moment().format("yyyy-MM-DD HH:mm:ss")
        }]);
        
        return response;
    }

    async revokeToken(user_id: string): Promise<void> {
        await this.delete(qc => qc.where("user_id", user_id));
    }

    async findToken(token: string): Promise<UserAccount> {
        const tokenDetail = await this.first(qc => qc
            .where("token", token)
            .andWhere("expire_at",">", moment().unix()));
        
        if(tokenDetail){
            return tokenDetail;
        }else{
            throw new UnauthorizedError();
        }
    }

}
