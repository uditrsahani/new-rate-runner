import { LoggerMiddleware } from "app/utils/middlewares/LoggerMiddleware";
import { Authorized, Body, Get, InternalServerError, JsonController, Param, Patch, Post, QueryParams, UseAfter } from "routing-controllers";
import { Inject, Service } from "typedi";
import { Contact } from "../models/Contact";
import { ContactQueryParam } from "../models/ContactQueryParam";
import { ContactService } from "../services/ContactService";

@Service()
@Authorized()
@JsonController("/contact")
export class ContactController {

    @Inject(() => ContactService)
    private contactService: ContactService;

    @Get("/")
    async getContact(@QueryParams() queryParam: ContactQueryParam) {  
        try{     
            const contacts = await this.contactService.getContact(queryParam);
            return contacts;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Post("/")
    @UseAfter(LoggerMiddleware)
    async addContact(@Body() contacts: Contact[]) {
        try{
            const addContacts = await this.contactService.addContact(contacts);
            return addContacts;
        }catch(error) {
            console.log(error);
            throw new InternalServerError("Something went wrong.");
        }
    }

    @Patch("/:ct_uuid")
    @UseAfter(LoggerMiddleware)
    async updateContact(@Param("ct_uuid") ct_uuid: string,@Body() contact: Contact) {
        const updateContact = await this.contactService.updateContact(ct_uuid, contact);
        return updateContact;
    }

}
