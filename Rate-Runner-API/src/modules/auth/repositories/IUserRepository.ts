import { Token } from "typedi";
import { UserAccount } from "../models/UserAccount";
import { UserAccountQueryParam } from "../models/UserAccountQueryParam";
import { UserOwner } from "../models/UserOwner";

export interface IUserRepository {
    getAllUser(user_param: UserAccountQueryParam): Promise<UserAccount[]>
    addUser(user: UserAccount): Promise<any>
    getUser(user_param: UserAccountQueryParam): Promise<any>
    getTeam(user_team: string, user_id: string): Promise<UserAccount[]>
    updateUser(user_id: string, user: UserAccount): Promise<any>
    getUserCustOwner(user_id: string): Promise<any>
    addUserOwner(user_owner: UserOwner[]): Promise<any>
    deleteUserOwner(user_owners: UserOwner[]): Promise<any>
    getUserOwner(cus_id: string, user_id?: string): Promise<any>
    getRawCustOwner(user_id: string[]): Promise<any[]>
}

export const UserRepository = new Token<IUserRepository>();
