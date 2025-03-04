import { UserAccount } from "app/modules/auth/models/UserAccount";
import { Token } from "typedi";
import { CustomerProfile } from "../models/CustomerProfile";

export interface ICustomerOwnerRepository {
    getUserOwnerTeam(user: UserAccount): Promise<CustomerProfile[]>
    getUserOwnerWorker(caller_user_id: string): Promise<CustomerProfile[]>
}

export const CustomerOwnerToken = new Token<ICustomerOwnerRepository>();
