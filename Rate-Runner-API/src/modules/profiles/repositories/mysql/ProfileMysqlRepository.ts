import { MysqlRepository } from "app/core/MysqlRepository";
import { AgentProfile } from "app/modules/profiles/models/AgentProfile";
import { Service } from "typedi";
import { AgentProfileQueryParam } from "../../models/AgentProfileQueryParam";
import { CarrierProfile } from "../../models/CarrierProfile";
import { Competitor } from "../../models/CompetitorProfile";
import { CustomerProfile } from "../../models/CustomerProfile";
import { CustomerProfileQueryParam } from "../../models/CustomerProfileQueryParam";
import { AgentProfileRepositoryToken, IAgentProfileRepository } from "../IAgentProfileRepository";
import { CarrierProfileRepositoryToken, ICarrierProfileRepository } from "../ICarrierProfileRepository";
import { CompetitorProfileRepositoryToken, ICompetitorProfileRepository } from "../ICompetitorProfileRepostory";
import { CustomerProfileRepositoryToken, ICustomerProfileRepository } from "../ICustomerRepository";

@Service()
@Service(AgentProfileRepositoryToken)
@Service(CarrierProfileRepositoryToken)
@Service(CustomerProfileRepositoryToken)
@Service(CompetitorProfileRepositoryToken)
export class ProfileRepository extends MysqlRepository<AgentProfile> 
    implements IAgentProfileRepository,
               ICarrierProfileRepository,
               ICustomerProfileRepository,
               ICompetitorProfileRepository {

    public tableName: string = "agent";

    async getAgent(params: AgentProfileQueryParam) {
        const qc = this.getQueryBuilder();

        if(params.agent_id) {
            qc.where("agent_id", params.agent_id);
        }

        qc.select("agent.*")
          .select("city_country.cc_city_name AS agent_city_name")
          .select("city_country.cc_country_name AS agent_country_name")
          .leftJoin("city_country", function() {
            this.on("city_country.cc_city_id", "agent.agent_city_id")
                .andOn("city_country.cc_country_id", "agent.agent_country_id")
        })
          .orderBy("agent.agent_name")
        return await qc;
    }

    async addAgent(agent: AgentProfile) {
        const agentAdd = await this.getQueryBuilder<AgentProfile>()
            .insert([agent])
        return agentAdd;
    }

    async updateAgent(agent_id: string, agent: AgentProfile) {
        const agentUpdate = await this.getQueryBuilder()
            .update(agent)
            .where("agent_id", agent_id);
        return agentUpdate;
    }

    async getCarrier() {
        const carrier = await this.getQueryBuilder<CarrierProfile>("carrier")
            .select("carrier.*")
            .select("city_country.cc_city_name AS carrier_city_name")
            .select("city_country.cc_country_name AS carrier_country_name")
            .leftJoin("city_country", function() {
                this.on("city_country.cc_city_id", "carrier.cr_city_id")
                    .andOn("city_country.cc_country_id", "carrier.cr_country_id")
            })
            .orderBy("carrier.cr_name")
        return carrier;
    }

    async addCarrier(carrier: CarrierProfile) {
        const carrierAdd = await this.getQueryBuilder("carrier")
            .insert([carrier])
        return carrierAdd;
    }

    async updateCarrier(cr_id: string, carrier: CarrierProfile) {
        const carrierUpdate = await this.getQueryBuilder("carrier")
            .update(carrier)
            .where("cr_id", cr_id);
        return carrierUpdate;
    }

    async getCustomer(queryParam: CustomerProfileQueryParam) {
        const customer = this.getQueryBuilder<CustomerProfile>("customer")

        if(queryParam.cus_id) {
            customer.whereIn("customer.cus_id", queryParam.cus_id);
        }

        if(queryParam.cus_name) {
            customer.where("customer.cus_name", queryParam.cus_name);
        }

        customer
            .select("customer.*")
            .select("city_country.cc_city_name AS customer_city_name")
            .select("city_country.cc_country_name AS customer_country_name")
            .leftJoin("city_country", function() {
                this.on("city_country.cc_city_id", "customer.cus_city_id")
                    .andOn("city_country.cc_country_id", "customer.cus_country_id")
            })
            .orderBy("customer.cus_name");

        return await customer;
    }

    async getOwnerCustomer(user_id :string) {
        const customer = await this.getQueryBuilder<CustomerProfile>("customer")
            .select("customer.*")
            .leftJoin("user_owner", "user_owner.cus_id", "customer.cus_id")
            .where("user_owner.user_id", user_id);
        return customer;
    }

    async addCustomer(customer: CustomerProfile) {
        const customerAdd = await this.getQueryBuilder("customer")
            .insert([customer])
        return customerAdd;
    }

    async updateCustomer(cus_id: string, customer: CustomerProfile) {
        const customerUpdate = await this.getQueryBuilder("customer")
            .update(customer)
            .where("cus_id", cus_id);
        return customerUpdate;
    }

    async getCompetitor() {
        const competitor = await this.getQueryBuilder<Competitor>("competitor")
            .select("competitor.*")
            .select("city_country.cc_city_name AS competitor_city_name")
            .select("city_country.cc_country_name AS competitor_country_name")
            .leftJoin("city_country", function() {
                this.on("city_country.cc_city_id", "competitor.ct_city_id")
                    .andOn("city_country.cc_country_id", "competitor.ct_country_id")
            })
            .orderBy("competitor.ct_name")
        return competitor;
    }

    async addCompetitor(competitor: Competitor) {
        const competitorAdd = await this.getQueryBuilder("competitor")
            .insert([competitor])
        return competitorAdd;
    }

    async updateCompetitor(ct_id: string, competitor: Competitor) {
        const competitorUpdate = await this.getQueryBuilder("competitor")
            .update(competitor)
            .where("ct_id", ct_id);
        return competitorUpdate;
    }
} 
