import { Inject, Service } from "typedi";
import { AgentProfile } from "../models/AgentProfile";
import { AgentProfileRepositoryToken, IAgentProfileRepository } from "../repositories/IAgentProfileRepository";
import { exportExcel } from "app/utils/ExcelFactory";
import { v4 as uuidv4 } from 'uuid';
import { CarrierProfileRepositoryToken, ICarrierProfileRepository } from "../repositories/ICarrierProfileRepository";
import { CarrierProfile } from "../models/CarrierProfile";
import { CustomerProfileRepositoryToken, ICustomerProfileRepository } from "../repositories/ICustomerRepository";
import { CustomerProfile } from "../models/CustomerProfile";
import { CompetitorProfileRepositoryToken, ICompetitorProfileRepository } from "../repositories/ICompetitorProfileRepostory";
import { Competitor } from "../models/CompetitorProfile";
import { AgentProfileQueryParam } from "../models/AgentProfileQueryParam";
import { CustomerProfileQueryParam } from "../models/CustomerProfileQueryParam";
import { UserAccount } from "app/modules/auth/models/UserAccount";
import { IUserRepository, UserRepository } from "app/modules/auth/repositories/IUserRepository";
import { UserManagementService } from "app/modules/auth/services/UserManagementService";
import { LeaderWorkerService } from "app/modules/leader/services/LeaderWorkerService";
import { UserAccountQueryParam } from "app/modules/auth/models/UserAccountQueryParam";
import { ContactService } from "app/modules/contact/services/ContactService";
import { ContactQueryParam } from "app/modules/contact/models/ContactQueryParam";

@Service()
export class ProfileService {
    
    @Inject(AgentProfileRepositoryToken)
    private agentProfileRepository: IAgentProfileRepository;

    @Inject(CarrierProfileRepositoryToken)
    private carrierProfileRepository: ICarrierProfileRepository;

    @Inject(CustomerProfileRepositoryToken)
    private customerProfileRepository: ICustomerProfileRepository;

    @Inject(CompetitorProfileRepositoryToken)
    private competitorProfileRepository: ICompetitorProfileRepository;

    @Inject(UserRepository)
    private userRepository: IUserRepository;

    @Inject(() => UserManagementService)
    private userManagementService: UserManagementService;

    @Inject(() => LeaderWorkerService)
    private leaderWorkerService: LeaderWorkerService;

    @Inject(() => ContactService)
    private contactService: ContactService;

    async getAgent(params?: AgentProfileQueryParam) {
        const agents = await this.agentProfileRepository.getAgent(params)
        return agents;
    }

    async exportAgent(params?: AgentProfileQueryParam) {
        const agents = await this.getAgent(params);

        const header: string[] = [
            "Agent Name",
            "City",
            "Country",
            "Agent Code",
            "Agent Address",
            "Agent Type",
            "Agent Other",
            "Agent Mobile",
            "Agent Phone",
            "Agent Email",
            "Agent Official",
            "Agent Website",
            "Agent Remark",
            "Agent Disable"
        ];
        
        const data: string[][] = []

        agents.forEach((agent) => {
            const row = [
                agent.agent_name,
                agent.agent_city_name,
                agent.agent_country_name,
                agent.agent_code,
                agent.agent_address,
                agent.agent_type,
                agent.agent_other,
                agent.agent_mobile,
                agent.agent_phone,
                agent.agemt_mail,
                agent.agent_official_social_id,
                agent.agent_website,
                agent.agent_remark,
                agent.agent_disable ? "True" : "False"
            ];
            data.push(row);
        });

        const excel = await exportExcel('Agent', header, data);

        const contactParam = new ContactQueryParam();
        contactParam.ct_refer_table = "agent";
        const AgentContact = await this.contactService.getContact(contactParam);

        const headerContact: string[] = [
            "Agent Name",
            "Contact Name",
            "Position",
            "Department",
            "Email",
            "Mobile",
            "Phone",
            "Social ID",
            "Contact Type",
            "Contact Disable"
        ];

        const contactData: string[][] = [];
        AgentContact.forEach((contact) => {
            const row = [
                contact.agent_name,
                contact.ct_name,
                contact.ct_position,
                contact.ct_department,
                contact.ct_mail,
                contact.ct_mobile,
                contact.ct_phone,
                contact.ct_social_id,
                contact.ct_type,
                contact.ct_disable ? "True" : "False"
            ];
            contactData.push(row);
        });

        const contactExcel = await exportExcel('Agent Contact', headerContact, contactData, excel);
        const buffer = await contactExcel.xlsx.writeBuffer();
        return buffer
    }

    async addAgent(agent: AgentProfile) {
        agent.agent_id = uuidv4();
        const agentAdd = await this.agentProfileRepository.addAgent(agent);
        return { agent_id: agent.agent_id };
    }

    async updateAgent(agent_id: string, agent: AgentProfile) {
        delete agent.agent_id;
        const agentUpdate = await this.agentProfileRepository.updateAgent(agent_id, agent);
        return agentUpdate;
    }

    async exportSales() {
        const user_param: UserAccountQueryParam = new UserAccountQueryParam();
        user_param.user_roles = ["sales", "salesManager", "seniorManager"];
        const sales = await this.userManagementService.getAllUser(user_param);

        const header: string[] = [
            "Salesman Name",
            "Mobile",
            "Phone",
            "Email",
            "Social ID",
            "Position",
            "Role",
            "Team",
            "Disable"
        ];
        
        const data: string[][] = []

        sales.forEach((sale) => {
            const row = [
                sale.user_fullname,
                sale.user_mobile,
                sale.user_phone,
                sale.user_mail,
                sale.user_social_id,
                sale.user_level,
                sale.user_role,
                sale.user_team,
                sale.user_disable ? "True" : "False"
            ];
            data.push(row);
        });

        const excel = await exportExcel('Sales', header, data);
        const buffer = await excel.xlsx.writeBuffer();
        return buffer
    }

    async getCarrier() {
        const carrier = await this.carrierProfileRepository.getCarrier();
        return carrier;
    }

    async exportCarrier() {
        const carriers = await this.getCarrier();

        const header: string[] = [
            "Carrier Name",
            "City",
            "Country",
            "Carrier Code",
            "Carrier Address",
            "Carrier Mobile",
            "Carrier Phone",
            "Carrier Email",
            "Carrier Officail Social",
            "Carrier Website",
            "Carrier Remark",
            "Carrier Disable"
        ];
        
        const data: string[][] = []

        carriers.forEach((carrier) => {
            const row: any = [
                carrier.cr_name,
                carrier.carrier_city_name,
                carrier.carrier_country_name,
                carrier.cr_code,
                carrier.cr_address,
                carrier.cr_mobile,
                carrier.cr_phone,
                carrier.cr_mail,
                carrier.cr_official_social_id,
                carrier.cr_website,
                carrier.cr_remark,
                carrier.cr_disable ? "True" : "False"
            ];
            data.push(row);
        });

        const excel = await exportExcel('Carrier', header, data);

        const contactParam = new ContactQueryParam();
        contactParam.ct_refer_table = "carrier";
        const CarrierContact = await this.contactService.getContact(contactParam);

        const headerContact: string[] = [
            "Carrier Name",
            "Contact Name",
            "Position",
            "Department",
            "Email",
            "Mobile",
            "Phone",
            "Social ID",
            "Contact Type",
            "Contact Disable"
        ];

        const contactData: string[][] = [];
        CarrierContact.forEach((carrier) => {
            const row = [
                carrier.cr_name,
                carrier.ct_name,
                carrier.ct_position,
                carrier.ct_department,
                carrier.ct_mail,
                carrier.ct_mobile,
                carrier.ct_phone,
                carrier.ct_social_id,
                carrier.ct_type,
                carrier.ct_disable ? "True" : "False"
            ];
            contactData.push(row);
        });

        const contactExcel = await exportExcel('Carrier Contact', headerContact, contactData, excel);
        const buffer = await contactExcel.xlsx.writeBuffer();
        return buffer
    }

    async addCarrier(carrier: CarrierProfile) {
        carrier.cr_id = uuidv4();
        const carrierAdd = await this.carrierProfileRepository.addCarrier(carrier);
        return { cr_id: carrier.cr_id };
    }

    async updateCarrier(cr_id: string, carrier: CarrierProfile) {
        delete carrier.cr_id;
        const carrierUpdate = await this.carrierProfileRepository.updateCarrier(cr_id, carrier);
        return carrierUpdate;
    }

    async getCustomer(queryParam: CustomerProfileQueryParam, user: UserAccount) {
        switch(user.user_role) {
            case "seniorManager": {
                const customers = await this.getCustByTeam(queryParam, user);
                return customers;
            }
            case "salesManager": {
                if(user.user_team === "BD") {
                    const customers = await this.getCustByTeam(queryParam, user);
                    return customers;
                } else {
                    const customers = await this.getCustByLeader(queryParam, user);
                    return customers;
                }
            }
            case "sales": {
                if(user.user_team === "BD") {
                    const customers = await this.getCustByTeam(queryParam, user);
                    return customers;
                } else {
                    const customers = await this.getCustByCaller(queryParam, user);
                    return customers;
                }
            }
            default: {
                const customers = await this.customerProfileRepository.getCustomer(queryParam);
                return customers;
            }
        }
    }

    async exportCustomer(queryParam: CustomerProfileQueryParam, user: UserAccount) {
        const customers = await this.getCustomer(queryParam, user);

        const header: string[] = [
            "Customer Name",
            "Sale Owner",
            "City",
            "Country",
            "Customer Address",
            "Customer Type",
            "Customer Industry",
            "Customer Mobile",
            "Customer Phone",
            "Customer Email",
            "Customer Offical Social",
            "Customer Website",
            "Customer Disable"
        ];
        
        const data: string[][] = []

        for(let i = 0; i < customers.length; i++) {
            const customer = customers[i];
            const sale_owner = await this.userManagementService.getUserOwner(customer.cus_id, user);
            const sale_owner_names: string[] = sale_owner.map((sale: any) => sale.user_fullname);

            const row = [
                customer.cus_name,
                sale_owner_names.join(', '),
                customer.customer_city_name,
                customer.customer_country_name,
                customer.cus_address,
                customer.cus_type,
                customer.cus_industry,
                customer.cus_mobile,
                customer.cus_phone,
                customer.cus_mail,
                customer.cus_official_social_id,
                customer.cus_website,
                customer.cus_disable ? "True" : "False"
            ];
            data.push(row);
        };

        const excel = await exportExcel('Customer', header, data);

        const contactParam = new ContactQueryParam();
        contactParam.ct_refer_table = "customer";
        const CustomerContact = await this.contactService.getContact(contactParam);

        const headerContact: string[] = [
            "Customer Name",
            "Contact Name",
            "Position",
            "Department",
            "Email",
            "Mobile",
            "Phone",
            "Social ID",
            "Contact Type",
            "Contact Disable"
        ];

        const contactData: string[][] = [];
        CustomerContact.forEach((contact) => {
            const row = [
                contact.cus_name,
                contact.ct_name,
                contact.ct_position,
                contact.ct_department,
                contact.ct_mail,
                contact.ct_mobile,
                contact.ct_phone,
                contact.ct_social_id,
                contact.ct_type,
                contact.ct_disable ? "True" : "False"
            ];
            contactData.push(row);
        });

        const contactExcel = await exportExcel('Customer Contact', headerContact, contactData, excel);
        const buffer = await contactExcel.xlsx.writeBuffer();
        return buffer
    }

    async getOwnerCustomer(user_id :string) {
        const customer = await this.customerProfileRepository.getOwnerCustomer(user_id);
        return customer;
    }

    async getCustByTeam(queryParam: CustomerProfileQueryParam, user: UserAccount) {
        const cust_ids: string[] = [];
        const user_param = new UserAccountQueryParam();
        user_param.user_team = user.user_team;
        const user_in_team: UserAccount[] = await this.userManagementService.getAllUser(user_param);
        const user_id_in_team: string[] = user_in_team.map((user) => { return user.user_id});
        const cust_id = await this.userRepository.getRawCustOwner(user_id_in_team);

        cust_id.map((cust) => {
            if(cust.cus_id) {
                cust_ids.push(cust.cus_id)
            }
        });

        queryParam.cus_id = cust_ids;
        const customer = await this.customerProfileRepository.getCustomer(queryParam);
        return customer;
    }

    async getCustByLeader(queryParam: CustomerProfileQueryParam, user: UserAccount) {
        const cust_ids: string[] = [];
        const user_worker = await this.leaderWorkerService.getLeaderWorker(user.user_id);
        const user_id_worker = user_worker.map((worker) => { return worker.worker_user_id });
        const cust_id = await this.userRepository.getRawCustOwner([...user_id_worker, user.user_id]);

        cust_id.map((cust) => {
            if(cust.cus_id) {
                cust_ids.push(cust.cus_id)
            }
        });

        queryParam.cus_id = cust_ids;
        const customer = await this.customerProfileRepository.getCustomer(queryParam);
        return customer;
    }

    async getCustByCaller(queryParam: CustomerProfileQueryParam, user: UserAccount) {
        const cust_ids: string[] = [];
        const cust_id: any[] = await this.userRepository.getRawCustOwner([user.user_id]);

        cust_id.map((cust) => {
            if(cust.cus_id) {
                cust_ids.push(cust.cus_id)
            }
        });

        queryParam.cus_id = cust_ids;
        const customer = await this.customerProfileRepository.getCustomer(queryParam);
        return customer;
    }

    async addCustomer(customer: CustomerProfile) {
        customer.cus_id = uuidv4();
        const customerAdd = await this.customerProfileRepository.addCustomer(customer);
        return { cus_id: customer.cus_id };
    }

    async updateCustomer(cus_id: string, customer: CustomerProfile) {
        delete customer.cus_id;
        const customerUpdate = await this.customerProfileRepository.updateCustomer(cus_id, customer);
        return customerUpdate;
    }

    async getCompetitor() {
        const competitor = await this.competitorProfileRepository.getCompetitor();
        return competitor;
    }

    async exportCompetitor() {
        const competitors = await this.getCompetitor();

        const header: string[] = [
            "Competitor Name",
            "City",
            "Country",
            "Competitor Code",
            "Competitor Address",
            "Competitor Mobile",
            "Competitor Phone",
            "Competitor Email",
            "Competitor Officail Socail",
            "Competitor Website",
            "Competitor Remark",
            "Competitor Disable"
        ];
        
        const data: string[][] = []

        competitors.forEach((competitor) => {
            const row = [
                competitor.ct_name,
                competitor.competitor_city_name,
                competitor.competitor_country_name,
                competitor.ct_code,
                competitor.ct_address,
                competitor.ct_mobile,
                competitor.ct_phone,
                competitor.ct_mail,
                competitor.ct_official_social_id,
                competitor.ct_website,
                competitor.ct_remark,
                competitor.ct_disable ? "True" : "False"
            ];
            data.push(row);
        });

        const excel = await exportExcel('Competitor', header, data);
        const buffer = await excel.xlsx.writeBuffer();
        return buffer
    }

    async addCompetitor(competitor: Competitor) {
        competitor.ct_id = uuidv4();
        const competitorAdd = await this.competitorProfileRepository.addCompetitor(competitor);
        return { ct_id: competitor.ct_id };
    }

    async updateCompetitor(ct_id: string, competitor: Competitor) {
        delete competitor.ct_id;
        const competitorUpdate = await this.competitorProfileRepository.updateCompetitor(ct_id, competitor);
        return competitorUpdate;
    }
}
