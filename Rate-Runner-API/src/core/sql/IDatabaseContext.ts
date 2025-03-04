import { IUnitOfWork } from "app/patterns";
import { IAuthenticationRepository } from "../../modules/auth/repositories/IAuthenticationRepository";

export interface IDatabaseContext extends IUnitOfWork {
    authenticationRepository: IAuthenticationRepository;
}
