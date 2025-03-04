import { Inject, Service } from "typedi";
import { AuthenticationResult } from "../utils/AuthenticationResult";
import { AuthenticationDriverToken, IAuthenticationDriver } from "../utils/IAuthenticationDriver";
import * as jwt from "jwt-simple";
import { ForbiddenError, UnauthorizedError } from "routing-controllers";
import bcrypt from "bcrypt";

@Service()
export class AuthenticationService {

    @Inject(AuthenticationDriverToken)
    private authenticationDriver: IAuthenticationDriver;
    
    public async login(username: string, password: string) {
        const userFound = await this.authenticationDriver.login(username);

        if(!userFound) {
            throw new UnauthorizedError("User invalid.");
        }

        console.log("AuthenticationService Service Test: ", password, userFound);
        const match = await bcrypt.compare(password, userFound.user_password_hash);
        
        if(!match) {
            throw new UnauthorizedError("User invalid.");
        }

        return this.loginManage(userFound);
    }

    async azureLogin(username: string) {
        const userFound = await this.authenticationDriver.azureLogin(username);

        if(!userFound) {
            throw new ForbiddenError("User invalid.");
        }

        return this.loginManage(userFound);
    }

    async logout(user_id: string) {
        const revoke = await this.authenticationDriver.logout(user_id);
        return revoke;
    }

    private async loginManage(userFound: AuthenticationResult) {
        let user_role = userFound.user_role;

        const issued_date = new Date().getTime();

        const payload = {
            sub: userFound.user_username,
            user_role: user_role,
            iat: issued_date
        };

        const SECRET_KEY = process.env.SECRET_KEY;
        const token = jwt.encode(payload, SECRET_KEY);

        await this.authenticationDriver.invokeToken(token, userFound.user_id);

        const response = {
            token: token,
            user_id: userFound.user_id,
            user_mail: userFound.user_mail,
            user_name: userFound.user_username,
            user_role: userFound.user_role,
            user_fullname: userFound.user_fullname,
            user_phone: userFound.user_phone,
            user_mobile: userFound.user_mobile,
            user_team: userFound.user_team
        }

        return response;
    }
}
