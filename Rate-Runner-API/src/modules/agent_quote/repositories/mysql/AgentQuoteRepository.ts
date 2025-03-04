import { MysqlRepository } from "app/core/MysqlRepository";
import { Service } from "typedi";
import { AgentQuote } from "../../models/AgentQuote";
import { AgentQuoteQueryParam } from "../../models/AgentQuoteQueryParam";
import { AgentQuoteRepositoryToken, IAgentQuoteRepository } from "../IAgentQuoteRepository";

@Service()
@Service(AgentQuoteRepositoryToken)
export class AgentQuoteRepository extends MysqlRepository<AgentQuote> implements IAgentQuoteRepository  {
    public tableName: string = "agent_quote";

    async getAgentQ(param: AgentQuoteQueryParam) {
        const aq = this.getQueryBuilder();
        
        if(param.aq_id) {
            aq.where("aq_id", param.aq_id);
        }

        aq.select("*")
          .leftJoin("agent", "agent.agent_id", "agent_quote.aq_agent_id");
        return aq;
    }

    async getAgentQuuid(agent_name: string) {
        const agent_uuid = await this.getQueryBuilder()
            .select("agent_uuid")
            .where("agent_name", agent_name)
            .first();
        return agent_uuid;
    }

    async getAgentQFilename(aq_id: string) {
        const aq = await this.getQueryBuilder()
            .select("aq_filename")
            .where("aq_id", aq_id)
            .first();
        return aq;
    }

    async addAgentQ(aq: AgentQuote[]) {
        const aqAdd = this.getQueryBuilder()
            .insert(aq)
            .onConflict(["agent_quote.aq_agent_id", "agent_quote.aq_inq_no"])
            .ignore();
        return await aqAdd;
    }

    async updateAgentQFilename(filename: string, aq_id: string) {
        const updateFilename = await this.getQueryBuilder()
            .update({ aq_filename: filename})
            .where("aq_id", aq_id);

        return updateFilename;
    }

    async updateAgentQ(aq_id: string, aq: AgentQuote) {
        const aqUpdate = await this.getQueryBuilder()
            .update(aq)
            .where("aq_id", aq_id);
        return aqUpdate;
    }
}
