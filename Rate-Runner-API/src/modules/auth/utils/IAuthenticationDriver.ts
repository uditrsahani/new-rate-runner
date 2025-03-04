import { Token } from "typedi";
import { AuthenticationResult } from "./AuthenticationResult";

export interface IAuthenticationDriver<TUserAccount = any> {
    login(user: string): Promise<AuthenticationResult>;
    azureLogin(username: string): Promise<AuthenticationResult>;
    logout(token: string): Promise<void>;
    invokeToken(token: string, user_id: string): Promise<void>;
    revokeToken(user_id: string): Promise<void>;
    authorize<TPermissionEnum>(user: TUserAccount, permissions: TPermissionEnum[]): Promise<boolean>;
    validateToken(token: string): Promise<TUserAccount>;
}

export const AuthenticationDriverToken = new Token<IAuthenticationDriver>();
