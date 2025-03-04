import { Authorized, Body, ContentType, Get, InternalServerError, JsonController, NotFoundError, Param, Patch, Post, QueryParams, UploadedFile, UseAfter } from "routing-controllers";
import { Inject, Service } from "typedi";
import { AgentQuote } from "../models/AgentQuote";
import { AgentQuoteService } from "../services/AgentQuoteService";
import { fileUploadOptions } from "app/utils/MulterConfig";
import { AgentQuoteQueryParam } from "../models/AgentQuoteQueryParam";
import { LoggerMiddleware } from "app/utils/middlewares/LoggerMiddleware";

@Service()
@Authorized()
@JsonController('/agent')
export class AgentQuoteController {

    @Inject(() => AgentQuoteService)
    private agentQuoteService: AgentQuoteService;

    @Get('/quote')
    async getAgentQ(@QueryParams() param: AgentQuoteQueryParam) {
        try{
            const aq = await this.agentQuoteService.getAgentQ(param);
            return aq;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Post('/quote')
    @UseAfter(LoggerMiddleware)
    async addAgentQ(@Body() aq: AgentQuote[]) {   
        try{
            const aqAdd = await this.agentQuoteService.addAgentQ(aq);
            return aqAdd;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Get('/quote/:aq_id/file')
    @ContentType("text/plain")
    async getAgentQFilename(@Param("aq_id") aq_id: string) {
        try{
            const file = await this.agentQuoteService.getAgentQFilename(aq_id);
            return file;
        }catch(error) {
            if(error instanceof NotFoundError) {
                throw new NotFoundError("file not found");
            }
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Post('/quote/:aq_id/file')
    @UseAfter(LoggerMiddleware)
    async addAgentQFile(@UploadedFile("file", { options: fileUploadOptions }) file: Express.Multer.File,
                        @Param("aq_id") aq_id: string) {   
        try{
            const aqAddFile = await this.agentQuoteService.addAgentQFile(file.filename, aq_id);
            return aqAddFile;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Patch('/quote/:aq_id')
    @UseAfter(LoggerMiddleware)
    async updateAgentQ(@Param("aq_id") aq_id: string, 
                       @Body() aq: AgentQuote) {
        try{
            const aqUpdate = await this.agentQuoteService.updateAgentQ(aq_id, aq)
            return aqUpdate;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }
}
