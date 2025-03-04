import { Database, DatabaseUnitOfWork } from "app/core/sql";
import { IDatabaseContext } from "app/core/sql/IDatabaseContext";
import { IAuthenticationRepository } from "app/modules/auth/repositories/IAuthenticationRepository";
import { IUserRepository, UserRepository } from "app/modules/auth/repositories/IUserRepository";
import { AuthenticationRepository } from "app/modules/auth/repositories/mysql/AuthenticationRepository";
import { Service } from "typedi";

@Service()
export class UnitOfWork extends DatabaseUnitOfWork implements IDatabaseContext{
    authenticationRepository: IAuthenticationRepository;
    userRepository: IUserRepository;

    constructor(connection: Database) {
        super(connection);
        this.authenticationRepository = new AuthenticationRepository(this);
        //this.userRepository = new UserRepository(this);
    }

}
