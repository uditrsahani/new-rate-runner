import { using } from "app/core/Disposable";
import { UnitOfWork } from "app/patterns/UnitOfWork";
import { UnitOfWorkFactory } from "app/patterns/UnitOfWorkFactory";
import { UnauthorizedError } from "routing-controllers";
import { Inject, Service } from "typedi";
import { UserAccount } from "../models/UserAccount";
import { UserAccountQueryParam } from "../models/UserAccountQueryParam";
import { UserRepository, IUserRepository } from "../repositories/IUserRepository";
import { AuthenticationResult } from "./AuthenticationResult";
import { AuthenticationDriverToken, IAuthenticationDriver } from "./IAuthenticationDriver";

@Service()
@Service(AuthenticationDriverToken)
export class AuthenticationPermissionDriver implements IAuthenticationDriver<UserAccount>{

    @Inject(UserRepository)
    private userRepository: IUserRepository;

    async login(username: string): Promise<AuthenticationResult> {
        const context = using(new UnitOfWorkFactory().create());
        const user = await context(async (unitOfWork: UnitOfWork) => {
            await unitOfWork.initialize();
            const result = await unitOfWork.authenticationRepository.login(username);
            await unitOfWork.authenticationRepository.clearExpiredToken();
            await unitOfWork.saveChanges();
            return result;
        });

        return user;
    }

    async azureLogin(username: string): Promise<AuthenticationResult> {
        const context = using(new UnitOfWorkFactory().create());
        const user = await context(async (unitOfWork: UnitOfWork) => {
            await unitOfWork.initialize();
            const result = await unitOfWork.authenticationRepository.azureLogin(username);
            await unitOfWork.authenticationRepository.clearExpiredToken();
            await unitOfWork.saveChanges();
            return result;
        });

        return user;
    }
    
    async logout(user_id: string): Promise<void> {
        const context = using(new UnitOfWorkFactory().create());
        const revoke = await context(async (unitOfWork: UnitOfWork) => {
            await unitOfWork.initialize();
            const result = await unitOfWork.authenticationRepository.revokeToken(user_id);
            await unitOfWork.saveChanges();
            return result;
        });

        return revoke;
    }

    async authorize<TPermissionEnum>(user: UserAccount, permissions: TPermissionEnum[]): Promise<boolean> {
        if (permissions.length > 0) {
            const user_role: TPermissionEnum = user.user_role as unknown as TPermissionEnum;
            return permissions.includes(user_role)
        } else {
            return true
        }
    }

    async validateToken(subjectToken: string): Promise<UserAccount> {
        const context = using(new UnitOfWorkFactory().create());
        const user = await context(async (unitOfWork: UnitOfWork) => {
            await unitOfWork.initialize();
            const token = await unitOfWork.authenticationRepository.findToken(subjectToken.replace("Bearer ",""));

            if (token) {
                const user_param = new UserAccountQueryParam();
                user_param.user_id = token.user_id;
                const user = await this.userRepository.getUser(user_param);
                delete user.user_password;
                delete user.user_password_hash;
                return user
            }
            
            throw new UnauthorizedError("Invalidate token.");
        });

        return user;
    }

    async invokeToken(token: string, user_id: string): Promise<void> {
        const context = using(new UnitOfWorkFactory().create());
        await context(async (unitOfWork: UnitOfWork) => {
            await unitOfWork.initialize();
            await unitOfWork.authenticationRepository.invokeToken(token, user_id);
            await unitOfWork.saveChanges();
        });
    }

    async revokeToken(user_id: string): Promise<void> {
        const context = using(new UnitOfWorkFactory().create());
        await context(async (unitOfWork: UnitOfWork) => {
            await unitOfWork.initialize();
            await unitOfWork.authenticationRepository.revokeToken(user_id);
            await unitOfWork.saveChanges();
        });
    }
}
