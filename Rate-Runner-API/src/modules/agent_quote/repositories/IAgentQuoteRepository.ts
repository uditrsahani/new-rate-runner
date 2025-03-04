import { Token } from "typedi";
import { AgentQuote } from "../models/AgentQuote";
import { AgentQuoteQueryParam } from "../models/AgentQuoteQueryParam";

export interface IAgentQuoteRepository {
    getAgentQ(param: AgentQuoteQueryParam): Promise<AgentQuote[]>
    getAgentQuuid(agent_name: string): Promise<string>
    getAgentQFilename(aq_id: string): Promise<any>
    addAgentQ(aq: AgentQuote[]): Promise<any>
    updateAgentQ(aq_id: string, aq: AgentQuote): Promise<any>
    updateAgentQFilename(filename: string, aq_id: string): Promise<any>
}

export const AgentQuoteRepositoryToken = new Token<IAgentQuoteRepository>();
