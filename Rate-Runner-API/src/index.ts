import "reflect-metadata";
import Container from "typedi";
import Dotenv from "dotenv";
import { ErrorResponderMiddleware } from "./utils/middlewares/ErrorResponderMiddleware";
import { Application } from "./core/Application";
import { LoggerMiddleware } from "./utils/middlewares/LoggerMiddleware";
import { UserRepository } from "./modules/auth/repositories/IUserRepository";
import { UserPgRepository } from "./modules/auth/repositories/mysql/UserMysqlRepository";
import { UserController } from "./modules/auth/controllers/UserController";
import { AuthenticationDriverToken } from "./modules/auth/utils/IAuthenticationDriver";
import { AuthenticationRepositoryToken } from "./modules/auth/repositories/IAuthenticationRepository";
import { AuthenticationRepository } from "./modules/auth/repositories/mysql/AuthenticationRepository";
import { AuthenticationPermissionDriver } from "./modules/auth/utils/AuthenticationDriver";
import { LoginController } from "./modules/auth/controllers/LoginController";
import { UserNotFoundError } from "./modules/auth/errors/UserNotFoundError";
import { AuthorizationModulePermission } from "./modules/auth/models/AuthorizationModulePermission";
import { TableMysqlRepository } from "./modules/tables/repositories/mysql/TableMysqlRepository";
import { RateTableRepositoryToken } from "./modules/tables/repositories/IRateTableRepository";
import { CityTableRepositoryToken } from "./modules/tables/repositories/ICityTableRepository";
import { TableController } from "./modules/tables/controllers/TableController";
import { PortTableRepositoryToken } from "./modules/tables/repositories/IPortTableRepository";
import { TATTableRepositoryToken } from "./modules/tables/repositories/ITATTableRepository";
import { ProfileController } from "./modules/profiles/controllers/ProfileController";
import { AgentProfileRepositoryToken } from "./modules/profiles/repositories/IAgentProfileRepository";
import { ProfileRepository } from "./modules/profiles/repositories/mysql/ProfileMysqlRepository";
import { CustomerProfileRepositoryToken } from "./modules/profiles/repositories/ICustomerRepository";
import { CarrierProfileRepositoryToken } from "./modules/profiles/repositories/ICarrierProfileRepository";
import { CompetitorProfileRepositoryToken } from "./modules/profiles/repositories/ICompetitorProfileRepostory";
import { ForecastRepositoryToken } from "./modules/forecast/repositories/IForecastRepository";
import { ForecastMysqlRepository } from "./modules/forecast/repositories/mysql/ForecastMysqlRepository";
import { ForecastController } from "./modules/forecast/controllers/ForecastController";
import { InquiryController } from "./modules/inquiry/controllers/InquiryController";
import { InquiryRepositoryToken } from "./modules/inquiry/repositories/IInquiryRepository";
import { InquiryMysqlRepository } from "./modules/inquiry/repositories/mysql/InquiryMysqlRepository";
import { LogController } from "./modules/logs/controllers/LogController";
import { LogRepositoryToken } from "./modules/logs/repositories/ILogRepository";
import { LogRepository } from "./modules/logs/repositories/mysql/LogRepository";
import { AgentQuoteRepository } from "./modules/agent_quote/repositories/mysql/AgentQuoteRepository";
import { AgentQuoteController } from "./modules/agent_quote/controllers/AgentQuoteController";
import { TransactionRepositoryToken } from "./modules/transaction/repositories/ITransactionRepository";
import { TransactionRepository } from "./modules/transaction/repositories/mysql/TransactionRepository";
import { ContactRepositoryToken } from "./modules/contact/repositories/IContactRepository";
import { ContactRepository } from "./modules/contact/repositories/mysql/ContactRepository";
import { ContactController } from "./modules/contact/controllers/ContactController";
import { AxiosFactory } from "./core/AxiosFactory";
import { AxiosFactoryConnection } from "./core/IAxiosConnection";
import { LeaderWorkerToken } from "./modules/leader/repositories/ILeaderWorkerRepository";
import { LeaderWorkerRepository } from "./modules/leader/repositories/mysql/LeaderWorkerRepository";
import { LeaderWorkerController } from "./modules/leader/controllers/LeaderWorkerController";
import { CustomerOwnerRepository } from "./modules/profiles/repositories/mysql/CustomerOwnerRepository";
import { CustomerOwnerToken } from "./modules/profiles/repositories/ICustomerOwnerRepository";
import { ScheduleController } from "./modules/schedule/controllers/ScheduleController";
import { CalendarMysqlRepository } from "./modules/schedule/repositories/mysql/CalendarMysqlRepository";
import { CalendarToken } from "./modules/schedule/repositories/ICalendarRepository";

Dotenv.config();
export class Server extends Application {
    constructor() {
        super({
            defaultErrorHandler: false
        });

        this.useContainer(Container)
            .useMiddleware(ErrorResponderMiddleware)
            .useMiddleware(LoggerMiddleware)
            .useController(UserController)
            .useController(TableController)
            .useController(ProfileController)
            .useController(ForecastController)
            .useController(InquiryController)
            .useController(AgentQuoteController)
            .useController(LogController)
            .useController(LoginController)
            .useController(ContactController)
            .useController(LeaderWorkerController)
            .useController(ScheduleController)
            .useAuthorizationChecker(async (action, permissions: AuthorizationModulePermission[]) => {
                if (action.request.headers.authorization) {
                    const authDriver = Container.get(AuthenticationDriverToken);
                    const user = await authDriver.validateToken(action.request.headers.authorization);
                    if(!user) {
                        action.request.headers.user_authorization = { user_username: "UNKNOW" };
                        return false;
                    }else{
                        action.request.headers.user_authorization = user;
                    }
                    return authDriver.authorize<AuthorizationModulePermission>(user, permissions);
                } else {
                    return false;
                }
            })
            .useCurrentUserChecker(async (action) => {
                if (action.request.headers.authorization) {
                    const authDriver = Container.get(AuthenticationDriverToken);
                    const user = await authDriver.validateToken(action.request.headers.authorization);
                    if(!user){
                        throw new UserNotFoundError();
                    }
                    return user;
                } else {
                    return false;
                }
            });

        Container.set(UserRepository, Container.get(UserPgRepository));
        Container.set(AuthenticationDriverToken,  Container.get(AuthenticationPermissionDriver));
        Container.set(AuthenticationRepositoryToken, Container.get(AuthenticationRepository));
        Container.set(RateTableRepositoryToken, Container.get(TableMysqlRepository));
        Container.set(CityTableRepositoryToken, Container.get(TableMysqlRepository));
        Container.set(PortTableRepositoryToken, Container.get(TableMysqlRepository));
        Container.set(TATTableRepositoryToken, Container.get(TableMysqlRepository));
        Container.set(AgentProfileRepositoryToken, Container.get(ProfileRepository));
        Container.set(CarrierProfileRepositoryToken, Container.get(ProfileRepository));
        Container.set(CustomerProfileRepositoryToken, Container.get(ProfileRepository));
        Container.set(CompetitorProfileRepositoryToken, Container.get(ProfileRepository));
        Container.set(ForecastRepositoryToken, Container.get(ForecastMysqlRepository));
        Container.set(InquiryRepositoryToken, Container.get(InquiryMysqlRepository));
        Container.set(LogRepositoryToken, Container.get(LogRepository));
        Container.set(AgentQuoteRepository, Container.get(AgentQuoteRepository));
        Container.set(TransactionRepositoryToken, Container.get(TransactionRepository));
        Container.set(ContactRepositoryToken, Container.get(ContactRepository));
        Container.set(AxiosFactoryConnection, Container.get(AxiosFactory));
        Container.set(LeaderWorkerToken, Container.get(LeaderWorkerRepository));
        Container.set(CustomerOwnerToken, Container.get(CustomerOwnerRepository));
        Container.set(CalendarToken, Container.get(CalendarMysqlRepository));
    }
    
    public async onProcessInterrupt() {
        await new Promise<void>((resolve, reject) => this.server.close((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })).then(() => {
            console.log("Terminated with code 0");
            process.exit(0)
        }).catch(() =>  {
            console.log("Terminated with code 1");
            process.exit(1)
        });
    }
}

const app = new Server();
app.start(parseInt(process.env.PORT) || 80);
