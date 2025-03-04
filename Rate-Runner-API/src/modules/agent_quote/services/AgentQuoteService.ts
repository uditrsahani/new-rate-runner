import { Inject, Service } from "typedi";
import { AgentQuote } from "../models/AgentQuote";
import { AgentQuoteRepositoryToken, IAgentQuoteRepository } from "../repositories/IAgentQuoteRepository";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from 'path';
import { NotFoundError } from "routing-controllers";
import { AgentQuoteQueryParam } from "../models/AgentQuoteQueryParam";

const appDir = path.dirname(require.main.filename);

@Service()
export class AgentQuoteService {

    @Inject(AgentQuoteRepositoryToken)
    private agentQuoteRepository: IAgentQuoteRepository;

    async getAgentQ(param: AgentQuoteQueryParam) {
        const aq = await this.agentQuoteRepository.getAgentQ(param);
        return aq;
    }

    async getAgentQuuid(agent_name: string) {
        const agent_uuid = await this.agentQuoteRepository.getAgentQuuid(agent_name);
        return agent_uuid;
    }

    async addAgentQ(aq: AgentQuote[]) {
        
        aq.forEach((aq) => {
            aq.aq_id = uuidv4();
        });
        
        const aqAdd = await this.agentQuoteRepository.addAgentQ(aq);
        return aqAdd;
    }

    async getAgentQFilename(aq_id: string) {
        const aq: any = await this.agentQuoteRepository.getAgentQFilename(aq_id);
        if (typeof aq === "undefined") {
            throw new NotFoundError("file not found");
        }

        const filename = aq.aq_filename;

        try{
            const file = fs.readFileSync(`${appDir}/upload/${filename}`);
            return file;
        }catch(error) {
            throw new NotFoundError("file not found");
        }
    }

    async addAgentQFile(filename: string, aq_id: string) {
        let old_filename = null;
        const param = new AgentQuoteQueryParam();
        param.aq_id = aq_id;
        const agent = await this.agentQuoteRepository.getAgentQ(param);

        if(agent) {
            old_filename = agent[0].aq_filename;
        }

        const updateFilename = await this.agentQuoteRepository.updateAgentQFilename(filename, aq_id);

        if(old_filename) {
            this.removeFile(old_filename);
        }

        return updateFilename;
    }

    async updateAgentQ(aq_id: string, aq: AgentQuote) {
        delete aq.aq_id;
        const aqUpdate = await this.agentQuoteRepository.updateAgentQ(aq_id, aq)
        return aqUpdate;
    }

    async removeFile(filename: string) {
        fs.unlink(`${appDir}/upload/${filename}`, (error) => {
            if(error) {
                console.log(error);
            }
        });
    }
}
