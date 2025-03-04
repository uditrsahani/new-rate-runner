import { UserManagementService } from "app/modules/auth/services/UserManagementService";
import { LoggerMiddleware } from "app/utils/middlewares/LoggerMiddleware";
import { Authorized, Body, BodyParam, CurrentUser, Get, InternalServerError, JsonController, Param, Patch, Post, QueryParams, UseAfter } from "routing-controllers";
import { Inject, Service } from "typedi";
import { UserDuplicateError } from "../errors/UserDuplicateError";
import { UserAccount } from "../models/UserAccount";
import { UserAccountQueryParam } from "../models/UserAccountQueryParam";
import { UserOwner } from "../models/UserOwner";

@Service()
@JsonController('/user')
export class UserController {
    @Inject(() => UserManagementService)
    private userManagementService: UserManagementService;
    
    @Post('/')
    @Authorized()
    @UseAfter(LoggerMiddleware)
    async addUser(@Body() user: UserAccount) {
        try{
            await this.userManagementService.addUser(user);
            return "User Created"
        }catch(error) {
            if (error instanceof UserDuplicateError) {
                throw new UserDuplicateError();
            } else {
                console.log(error);
                throw new InternalServerError("Something went wrong.");
            }
        }
    }

    @Post('/forget_password')
    @UseAfter(LoggerMiddleware)
    async forgetPassword(@BodyParam("user_mail") user_mail: string) {
        try{
            const result = await this.userManagementService.forgetPassword(user_mail);
            return result;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get('/')
    async getUserAll(@QueryParams() user_param: UserAccountQueryParam) {
        try{
            const users = await this.userManagementService.getAllUser(user_param);
            return users;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get('/team')
    async getTeam(@CurrentUser() user: UserAccount) {
        try{
            const users = await this.userManagementService.getUserTeam(user);
            return users;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get('/:user_id')
    async getUser(@Param("user_id") user_id: string) {
        try{
            await this.userManagementService.getUser(user_id);
            return "User Created"
        }catch(error) {
            if (error instanceof UserDuplicateError) {
                throw new UserDuplicateError();
            } else {
                console.log(error);
                throw new InternalServerError("Something went wrong.");
            }
        }
    }

    @Authorized()
    @Post('/owner')
    @UseAfter(LoggerMiddleware)
    async addUserOwner(@Body() user_owner: UserOwner[]) {
        try{
            const update_owner = await this.userManagementService.addUserOwner(user_owner);
            return update_owner;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Patch('/owner')
    @UseAfter(LoggerMiddleware)
    async deleteUserOwner(@Body() user_owner: UserOwner[]) {
        try{
            const delete_owner = await this.userManagementService.deleteUserOwner(user_owner);
            return delete_owner;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Get('/owner/:cust_id')
    async getUserOwner(@CurrentUser() user: UserAccount,
                       @Param("cust_id") cust_id: string) {
        try{
            const user_owner = await this.userManagementService.getUserOwner(cust_id, user);
            return user_owner;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Authorized()
    @Patch('/:user_id/reset/password')
    @UseAfter(LoggerMiddleware)
    async resetPassword(@Param("user_id") user_id: string,
                        @BodyParam("user_password") user_password: string,
                        @CurrentUser() caller: UserAccount) {
        try{
            const user = await this.userManagementService.resetPassword(user_id, user_password, caller);
            return user;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

}
