import { Token } from "typedi";
import { UserAccount } from "../models/UserAccount";
import { AuthenticationResult } from "../utils/AuthenticationResult";

export interface IAuthenticationRepository {
    login(username: string): Promise<AuthenticationResult>;
    azureLogin(username: string): Promise<AuthenticationResult>
    invokeToken(token: string, user_id: string): Promise<void>;
    revokeToken(user_id: string): Promise<void>;
    findToken(token: string): Promise<UserAccount>;
    clearExpiredToken(): Promise<any>;
}

export const AuthenticationRepositoryToken = new Token<IAuthenticationRepository>();
