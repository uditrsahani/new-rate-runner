import { Token } from "typedi";
import { Contact } from "../models/Contact";
import { ContactQueryParam } from "../models/ContactQueryParam";

export interface IContactRepository {
    getContact(queryParam: ContactQueryParam): Promise<Contact[]>
    addContact(contact: Contact[]): Promise<any>
    updateContact(ct_id: string, contact: Contact): Promise<any>
}

export const ContactRepositoryToken = new Token<IContactRepository>();
