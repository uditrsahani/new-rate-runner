import { Inject, Service } from "typedi";
import { Contact } from "../models/Contact";
import { ContactQueryParam } from "../models/ContactQueryParam";
import { ContactRepositoryToken, IContactRepository } from "../repositories/IContactRepository";
import { v4 as uuidv4 } from 'uuid';

@Service()
export class ContactService {

    @Inject(ContactRepositoryToken)
    private contactRepository: IContactRepository;

    async getContact(queryParam: ContactQueryParam) {
        const contacts = await this.contactRepository.getContact(queryParam);
        return contacts;
    }

    async addContact(contacts: Contact[]) {
        contacts.forEach((contact: Contact) => {
            contact.ct_uuid = uuidv4();
        });
        const addContacts = await this.contactRepository.addContact(contacts);
        return addContacts;
    }

    async updateContact(ct_uuid: string, contact: Contact) {
        delete contact.ct_uuid;
        const updateContact = await this.contactRepository.updateContact(ct_uuid, contact);
        return updateContact;
    }
}
