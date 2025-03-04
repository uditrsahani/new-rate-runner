import { MailService } from "app/modules/email/services/MailService";
import { Inject, Service } from "typedi";
import { UserAccount } from "../models/UserAccount";
import { UserAccountQueryParam } from "../models/UserAccountQueryParam";
import { UserOwner } from "../models/UserOwner";
import { UserRepository, IUserRepository } from "../repositories/IUserRepository";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { ForbiddenError } from "routing-controllers";

@Service()
export class UserManagementService {
    @Inject(UserRepository)
    private userRepository: IUserRepository;

    @Inject(() => MailService)
    protected mailService: MailService;
    
    public async getAllUser(user_param: UserAccountQueryParam) {
        const users = await this.userRepository.getAllUser(user_param);
        users.forEach((user) => {
            delete user.user_password;
            delete user.user_password_hash;
        });
        return users;
    }

    async forgetPassword(user_mail: string) {
        const user_param = new UserAccountQueryParam();
        user_param.user_mail = user_mail;
        const user = await this.userRepository.getUser(user_param);
        if(user) {
            await this.mailService.forgetPasswordMail(user_mail, user.user_password);
            return "Found";
        } else {
            return "Not Found";
        }
    }

    async getUserCustOwner(user_id: string) {
        const cust_id = await this.userRepository.getUserCustOwner(user_id);
        return cust_id;
    }

    public async getUser(user_id: string = null) {
        const user_param = new UserAccountQueryParam();
        user_param.user_id = user_id;
        const user = await this.userRepository.getUser(user_param);
        return user;
    }

    async getUserOwner(cust_id: string, caller: UserAccount) {
        switch(caller.user_role) {
            case "sales": {
                const user_owner: any[] = await this.userRepository.getUserOwner(cust_id, caller.user_id);
                if(user_owner[0]) {
                    if(caller.user_team === "BD") {
                        return [{
                            user_id: "BD Team",
                            user_fullname: "BD Team",
                            user_team: "BD Team",
                            user_role: "BD Team"
                        }]
                    } else {
                        return user_owner;
                    }
                } else {
                    return [];
                }
            }
            case "salesManager": {
                const user_owner: any[] = await this.userRepository.getUserOwner(cust_id);
                const user_in_team = user_owner.filter((user) => {
                    return user.user_team === caller.user_team;
                });

                if(user_owner[0]) {
                    if(caller.user_team === "BD") {
                        return [{
                            user_id: "BD Team",
                            user_fullname: "BD Team",
                            user_team: "BD Team",
                            user_role: "BD Team"
                        }]
                    } else {
                        return user_in_team;
                    }
                } else {
                    return [];
                }
            }
            default: {
                let found_bd = false;
                let found_marketing = false;
                const user_flitered = [];
                const user_owner: any[] = await this.userRepository.getUserOwner(cust_id);
                user_owner.forEach((user) => {
                    if(user.user_team === "BD") {
                        found_bd = true;
                    } else {
                        if(user.user_role === "marketing" || user.user_role === "marketingManager") {
                            found_marketing = true;
                        } else {
                            user_flitered.push(user);
                        }
                    }
                });

                if(found_bd) {
                    user_flitered.push({
                        user_id: "BD Team",
                        user_fullname: "BD Team",
                        user_team: "BD Team",
                        user_role: "BD Team"
                    });
                }

                if(found_marketing) {
                    user_flitered.push({
                        user_id: "Marketing Team",
                        user_fullname: "Marketing Team",
                        user_team: "Marketing Team",
                        user_role: "Marketing Team"
                    });
                }

                return user_flitered;
            }
        }
    }

    async getUserTeam(user: UserAccount) {
        switch(user.user_role) {
            case "sales": {
                return [user];
            }
            case "seniorManager":
            case "salesManager": {
                const user_param = new UserAccountQueryParam();
                user_param.user_team = user.user_team;
                const user_manager_in_team = await this.userRepository.getAllUser(user_param);
                const users = [...user_manager_in_team];
                return users;
            }
            default: {
                return await this.getAllUser(new UserAccountQueryParam());
            }
        }
    }

    async addUserOwner(user_owner: UserOwner[]) {
        const user_owner_list: UserOwner[] = [];

        const bd_params = new UserAccountQueryParam();
        bd_params.user_team = "BD";
        const users_bd = await this.getAllUser(bd_params);

        const marketing_params = new UserAccountQueryParam();
        marketing_params.user_team = "Marketing";
        
        const users_marketing = await this.getAllUser(marketing_params);
        const users_marketing_manager = await this.getAllUser(marketing_params);
        const marketing_team = [...users_marketing, ...users_marketing_manager];

        let bd_added = false;
        let marketing_added = false;

        user_owner.forEach((user) => {
            if(user.user_team === "BD" && !bd_added) {
                bd_added = true;
                users_bd.forEach((user_bd) => {
                    const owner: UserOwner = new UserOwner();
                    owner.user_id = user_bd.user_id;
                    owner.cus_id = user.cus_id;
                    user_owner_list.push(owner);
                });
            } else if((user.user_team === "Marketing") && !marketing_added) {
                marketing_added = true;
                marketing_team.forEach((user_marketing) => {
                    const owner: UserOwner = new UserOwner();
                    owner.user_id = user_marketing.user_id;
                    owner.cus_id = user.cus_id;
                    user_owner_list.push(owner);
                });
            } else {
                user_owner_list.push(user);
            }
        });

        const user_add = await this.userRepository.addUserOwner(user_owner_list);
        return user_add;
    }

    async deleteUserOwner(user_owner: UserOwner[]) {
        const user_owner_list: UserOwner[] = [];

        const bd_params = new UserAccountQueryParam();
        bd_params.user_team = "BD";
        const users_bd = await this.getAllUser(bd_params);

        const marketing_params = new UserAccountQueryParam();
        marketing_params.user_team = "Marketing";
        const users_marketing = await this.getAllUser(marketing_params);

        user_owner.forEach((user) => {
            if(user.user_team === "BD") {
                users_bd.forEach((user_bd) => {
                    const owner: UserOwner = new UserOwner();
                    owner.user_id = user_bd.user_id;
                    owner.cus_id = user.cus_id;
                    user_owner_list.push(owner);
                });
            } else if(user.user_team === "Marketing") {
                users_marketing.forEach((user_bd) => {
                    const owner: UserOwner = new UserOwner();
                    owner.user_id = user_bd.user_id;
                    owner.cus_id = user.cus_id;
                    user_owner_list.push(owner);
                });
            } else {
                user_owner_list.push(user);
            }
        });

        const user_add = await this.userRepository.deleteUserOwner(user_owner_list);
        return user_add;
    }

    public async addUser(user: UserAccount) {
        const saltRounds = 12;
        const hash = await bcrypt.hash(user.user_password, saltRounds);
        user.user_password_hash = hash;
        user.user_id = uuidv4();

        const user_add = await this.userRepository.addUser(user);
        return user_add;
    }

    public async updateUser(user_id: string, user: UserAccount) {
        delete user.user_id;
        delete user.user_password;
        delete user.user_password_hash;
        const user_update = await this.userRepository.updateUser(user_id, user);
        return user_update;
    }

    public async resetPassword(user_id: string, user_password: string, caller: UserAccount) {
        const userToAction = await this.getUser(user_id);
        if(caller.user_role === "systemAdmin" || userToAction.user_id === user_id) {
            const user = new UserAccount();
            const saltRounds = 12;
            const hash = await bcrypt.hash(user_password, saltRounds);
            user.user_password = user_password;
            user.user_password_hash = hash;
            const user_update = await this.userRepository.updateUser(user_id, user);
            return user_update;
        } else {
            throw new ForbiddenError("Caller role not accept");
        }
    }
}
