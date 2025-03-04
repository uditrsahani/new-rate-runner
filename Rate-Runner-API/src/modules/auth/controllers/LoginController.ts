import { BodyParam, 
         CurrentUser, 
         ForbiddenError, 
         Get, 
         InternalServerError, 
         JsonController, 
         Post,
         QueryParams, 
         Res, 
         Req,
         UnauthorizedError, 
         UseAfter} from "routing-controllers";
import { Inject, Service } from "typedi";
import { UserAccount } from "../models/UserAccount";
import { AuthenticationService } from "../services/AuthenticationService";
import { AuthenticationResult, 
         AuthorizationCodeRequest, 
         AuthorizationUrlRequest, 
         ConfidentialClientApplication, 
         Configuration, 
         LogLevel } from '@azure/msal-node';
import Dotenv from "dotenv";
import { Request, Response } from "express";
import { LogManager } from "app/core/Logger";
import moment from "moment";
Dotenv.config();

@Service()
@JsonController('/auth')
export class LoginController {

    @Inject(() => AuthenticationService)
    private authenticationService: AuthenticationService;
    private config: Configuration;
    private pca: ConfidentialClientApplication;

    constructor() {
        this.config = {
            auth: {
                clientId: process.env.CLIENT_ID,
                authority: `https://login.microsoftonline.com/${process.env.TENANT}` ,
                clientSecret: process.env.CLIENT_SECERT
            },
            system: {
                loggerOptions: {
                    loggerCallback: (loglevel: LogLevel, message: string, containsPii: boolean) => {
                        console.log(message);
                    },
                    piiLoggingEnabled: false,
                    logLevel:LogLevel.Verbose,
                }
            }
        };

        this.pca = new ConfidentialClientApplication(this.config);
    }

    @Get('/azure/login')
    async azureLogin() {
        try{
            const authCodeUrlParameters: AuthorizationUrlRequest = {
                scopes: ["user.read"],
                redirectUri: process.env.REDIRECT_URI,
            };
        
            const response: string = await this.pca.getAuthCodeUrl(authCodeUrlParameters);
            return response;
        }catch(error) {
            console.log(JSON.stringify(error));
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Get('/azure/redirect')
    async azureRedirect(@QueryParams() qp: any,
                        @Req() request: Request,
                        @Res() responseContext: Response) {
        try{
            const tokenRequest: AuthorizationCodeRequest = {
                code: qp.code,
                scopes: ["user.read"],
                redirectUri: process.env.REDIRECT_URI,
            };
    
            const response: AuthenticationResult = await this.pca.acquireTokenByCode(tokenRequest);
            const user = await this.authenticationService.azureLogin(response.account.username);

            const redirectValue: string[] = [
                `token=${user.token}`,
                `user_id=${user.user_id}`,
                `user_username=${user.user_name}`,
                `user_mail=${user.user_mail}`,
                `user_role=${user.user_role}`,
                `user_fullname=${user.user_fullname}`,
                `user_phone=${user.user_phone}`,
                `user_mobile=${user.user_mobile}`,
                `user_team=${user.user_team}`
            ];

            responseContext.redirect(`http://localhost:3000?${redirectValue.join('&')}`);
            this.logInsert(request, user.user_name, "Azure login");
            return responseContext;
        }catch(error) {
            if (error instanceof UnauthorizedError) {
                throw new UnauthorizedError("User invalid.");
            }else if(error instanceof ForbiddenError) {
                responseContext.redirect(`http://localhost:3000?token=null`);
                this.logInsert(request, "Unknow user", "Azure login fail");
                return responseContext;
            } else {
                console.log(error);
                throw new InternalServerError("Something went wrong.");
            }
        }
    }

    @Get('/verify')
    async azureVerify() {

    }

    @Post('/login')
    async login(
        @Req() request: Request,
        @BodyParam('user_username', { required: true }) user_username: string,
        @BodyParam('user_password', { required: true }) user_password: string) {
        try{
            const response = await this.authenticationService.login(user_username, user_password);
            this.logInsert(request, user_username, "Basic login");
            return response;
        }catch(error) {
            if (error instanceof UnauthorizedError) {
                throw new UnauthorizedError("User invalid.");
            } else {
                console.log(error);
                throw new InternalServerError("Something went wrong.");
            }
        }
    }

    @Post('/logout')
    async logout(@Req() request: Request,
                 @CurrentUser() user: UserAccount,){
        try{
            await this.authenticationService.logout(user.user_id);
            this.logInsert(request, user.user_username, "Logout");
            return "logout";
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    private async logInsert(request: Request, user_username: string, message: string = "") {
        const logger = LogManager.instance.logger;
        let datetime = moment().utcOffset(7).format('YYYY-MM-DD HH:mm:ss');
        let method = request.method;
        let url = request.url;
        let ip = request.ip;
        let log = `${datetime},${method}:${url},${user_username},${ip}`;
        logger.log("info", log);
    }

}
