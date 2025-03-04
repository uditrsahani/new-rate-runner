import { MysqlRepository } from "app/core/MysqlRepository";
import { Service } from "typedi";
import { Contact } from "../../models/Contact";
import { ContactQueryParam } from "../../models/ContactQueryParam";
import { ContactRepositoryToken, IContactRepository } from "../IContactRepository";

@Service()
@Service(ContactRepositoryToken)
export class ContactRepository extends MysqlRepository<Contact> implements IContactRepository {
    public tableName: string = "contact";

    async getContact(queryParam: ContactQueryParam) {
        const qc = this.getQueryBuilder();

        if(queryParam.ct_uuid) {
            qc.where("ct_uuid", queryParam.ct_uuid);
        }

        if(queryParam.ct_refer_id) {
            qc.where("ct_refer_id", queryParam.ct_refer_id);
        }

        if(queryParam.ct_refer_table) {
            qc.where("ct_refer_table", queryParam.ct_refer_table);

            switch(queryParam.ct_refer_table) {
                case "agent": {
                    qc.leftJoin("agent", "contact.ct_refer_id", "agent.agent_id")
                      .select("agent.agent_name")
                      .orderBy("agent.agent_name");
                    break;
                }

                case "customer": {
                    qc.leftJoin("customer", "contact.ct_refer_id", "customer.cus_id")
                      .select("customer.cus_name")
                      .orderBy("customer.cus_name");
                    break;
                }

                case "carrier": {
                    qc.leftJoin("carrier", "contact.ct_refer_id", "carrier.cr_id")
                      .select("carrier.cr_name")
                      .orderBy("carrier.cr_name");
                    break;
                }
            }
        }
        
        qc.select("contact.*")
        return await qc;
    }

    async addContact(contact: Contact[]) {
        const qc = this.getQueryBuilder();
        qc.insert(contact);
        return await qc;
    }

    async updateContact(ct_uuid: string, contact: Contact) {
        const qc = this.getQueryBuilder();
        qc.update(contact)
          .where("ct_uuid", ct_uuid);
        return await qc;
    }

}
