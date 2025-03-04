import { Token } from "typedi";
import { AgentProfile } from "../models/AgentProfile";
import { AgentProfileQueryParam } from "../models/AgentProfileQueryParam";

export interface IAgentProfileRepository {
    getAgent(params: AgentProfileQueryParam): Promise<AgentProfile[]>
    addAgent(agent: AgentProfile): Promise<any>
    updateAgent(agent_id: string, agent: AgentProfile): Promise<any>
}

export const AgentProfileRepositoryToken = new Token<IAgentProfileRepository>();
