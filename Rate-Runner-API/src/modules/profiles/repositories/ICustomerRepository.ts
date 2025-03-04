import { Token } from "typedi";
import { CustomerProfile } from "../models/CustomerProfile";
import { CustomerProfileQueryParam } from "../models/CustomerProfileQueryParam";

export interface ICustomerProfileRepository {
    getCustomer(queryParam: CustomerProfileQueryParam): Promise<CustomerProfile[]>
    getOwnerCustomer(user_id :string): Promise<CustomerProfile[]>
    addCustomer(customer: CustomerProfile): Promise<any>
    updateCustomer(cus_id: string, customer: CustomerProfile): Promise<any>
}

export const CustomerProfileRepositoryToken = new Token<ICustomerProfileRepository>()
