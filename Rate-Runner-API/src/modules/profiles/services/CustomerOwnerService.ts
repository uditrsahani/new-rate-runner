import { Inject, Service } from "typedi";
import { CustomerOwnerToken, ICustomerOwnerRepository } from "../repositories/ICustomerOwnerRepository";

@Service()
export class CustomerOwnerService {

    @Inject(CustomerOwnerToken)
    private customerOwnerRepository: ICustomerOwnerRepository;

    async getUserOwnerWorker(caller_user_id: string) {
        let cust_worker = await this.customerOwnerRepository.getUserOwnerWorker(caller_user_id);
        return cust_worker.map((cust) => {return cust.cus_id});
    }

}
