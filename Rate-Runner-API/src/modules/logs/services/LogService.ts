
import { MailService } from "app/modules/email/services/MailService";
import moment from "moment";
import { InternalServerError } from "routing-controllers";
import { Inject, Service } from "typedi";
import { LogMail } from "../models/LogMail";
import { ILogRepository, LogRepositoryToken } from "../repositories/ILogRepository";
import { v4 as uuidv4 } from "uuid"
import { UserAccount } from "app/modules/auth/models/UserAccount";

@Service()
export class LogService {
    @Inject(LogRepositoryToken)
    private logRepository: ILogRepository;

    @Inject(() => MailService)
    protected mailService: MailService;

    async getLogmail() {
        try{
            const log = await this.logRepository.getLogmail();
            return log;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    async addLogMail(log: LogMail, token: string, user: UserAccount) {
        try{
            log.timestamp = moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss");
            log.log_uuid = uuidv4();
            log.user_id = user.user_id;
            const sendMail = await this.mailService
                .notiAgentInquiry(token, user, log.agent_id, log.inq_uuid);
            delete log.to_mail;
            delete log.to_cc;
            delete log.subject;
            delete log.html;
            const logAdd = await this.logRepository.addLogMail(log);
            return logAdd;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    async addRawLogMail(log: LogMail, token: string, user: UserAccount) {
        try{
            log.timestamp = moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss");
            log.log_uuid = uuidv4();
            log.user_id = user.user_id;
            const sendMail = await this.mailService
                .sendRawMail(token, user, log);
            delete log.to_mail;
            delete log.to_cc;
            delete log.subject;
            delete log.html;
            const logAdd = await this.logRepository.addLogMail(log);
            return logAdd;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }
}
