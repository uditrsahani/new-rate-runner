import { MysqlRepository } from "app/core/MysqlRepository";
import { Service } from "typedi";
import { LogMail } from "../../models/LogMail";
import { ILogRepository, LogRepositoryToken } from "../ILogRepository";

@Service()
@Service(LogRepositoryToken)
export class LogRepository extends MysqlRepository<LogMail> implements ILogRepository {
    public tableName: string = "log_mail";

    async getLogmail() {
        const log = await this.getQueryBuilder()
            .select("*")
            .leftJoin("agent", "agent.agent_id", "log_mail.agent_id")
            .orderBy("log_mail.timestamp", "desc")
        return log;
    }

    async addLogMail(log: LogMail) {
        const logAdd = await this.getQueryBuilder()
            .insert([log]);
        return logAdd;
    }
}
