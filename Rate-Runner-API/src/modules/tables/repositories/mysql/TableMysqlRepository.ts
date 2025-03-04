import { MysqlRepository } from "app/core/MysqlRepository";
import { UserAccount } from "app/modules/auth/models/UserAccount";
import moment from "moment";
import { Service } from "typedi";
import { CityTable } from "../../models/CityTable";
import { PortTable } from "../../models/PortTable";
import { RateTable } from "../../models/RateTable";
import { RateTableQueryParam } from "../../models/RateTableQueryParam";
import { TatTable } from "../../models/TatTable";
import { CityTableRepositoryToken, ICityTableRepository } from "../ICityTableRepository";
import { IPortTableRepository, PortTableRepositoryToken } from "../IPortTableRepository";
import { IRateTableRepository, RateTableRepositoryToken } from "../IRateTableRepository";
import { ITATTableRepository, TATTableRepositoryToken } from "../ITATTableRepository";

@Service()
@Service(RateTableRepositoryToken)
@Service(CityTableRepositoryToken)
@Service(PortTableRepositoryToken)
@Service(TATTableRepositoryToken)
export class TableMysqlRepository extends MysqlRepository<RateTable> 
    implements IRateTableRepository,
               ICityTableRepository,
               IPortTableRepository,
               ITATTableRepository {

    public tableName: string = "rate_table";

    async addRateTable(rate: RateTable[]): Promise<any> {
        const rateAdd =  this.getQueryBuilder()
            .insert(rate);

        return await rateAdd;
    }

    async getRateTableByNo(input_no: string[]): Promise<Pick<RateTable, "rate_input_no">[]> {
        const rateDuplicate = await this.getQueryBuilder()
            .select("rate_input_no")
            .whereIn("rate_input_no", input_no);
        return rateDuplicate;
    }

    async getRateTable(queryParam: RateTableQueryParam): Promise<RateTable[]> {

        const qc = this.getQueryBuilder();
        
        if(queryParam.rate_id) {
            qc.andWhere("rate_id", queryParam.rate_id);
        }

        if(queryParam.rate_type) {
            qc.andWhere("rate_type", queryParam.rate_type);
        }

        if(queryParam.rate_cus_id) {
            qc.where(function () {
                this.where("rate_cus_id", queryParam.rate_cus_id)
                    .orWhereRaw("rate_cus_id IS NULL")
                    .orWhere("rate_cus_id", "");
            });
        }

        if(queryParam.rate_pod_id) {
            qc.andWhere("rate_pod_id", queryParam.rate_pod_id);
        }

        if(queryParam.rate_pol_id) {
            qc.andWhere("rate_pol_id", queryParam.rate_pol_id);
        }

        if(queryParam.rate_recommend) {
            qc.andWhere("rate_recommend", queryParam.rate_recommend);
        }

        if(queryParam.month) {
            qc.whereRaw(`MONTH(rate_timestamp) = ${queryParam.month}`);
        }

        if(queryParam.year) {
            qc.whereRaw(`YEAR(rate_timestamp) = ${queryParam.year}`);
        }

        if(queryParam.rate_date_from) {
            qc.andWhere("rate_timestamp", ">=", queryParam.rate_date_from);
        }

        if(queryParam.rate_date_to) {
            qc.andWhere("rate_timestamp", "<=", queryParam.rate_date_to);
        }

        if(queryParam.date) {
            const dateFilter = moment(queryParam.date).utcOffset(7).format("YYYY-MM-DD");
            qc.andWhere('rate_valid_from', '<=', dateFilter)
              .andWhere('rate_expired_to', '>=', dateFilter)
        }

        if(queryParam.inq_cargo_readiness) {
            const inq_cargo_readiness = moment(queryParam.inq_cargo_readiness).format("YYYY-MM-DD");
            qc.andWhere('rate_expired_to', '>=', inq_cargo_readiness);
        }

        if(queryParam.rate_expired_to) {
            qc.orWhere("rate_expired_to", ">=", queryParam.rate_expired_to)
        }

        if(queryParam.expired) {
            const dateNow = moment().utcOffset(7).add(1, "day").format("YYYY-MM-DD");
            qc.andWhere("rate_expired_to", ">=", dateNow)
        }

        const rate = await qc
            .select("rate_table.*")
            .select("agent.*")
            .select("carrier.*")
            .select("customer.*")
            .select("pod.port_id AS pod_port_id")
            .select("pod.port_city_id AS pod_port_city_id")
            .select("pod.port_country_id AS pod_port_country_id")
            .select("pod.port_name AS pod_port_name")
            .select("pod.port_region AS pod_port_region")
            .select("pol.port_id AS pol_port_id")
            .select("pol.port_city_id AS pol_port_city_id")
            .select("pol.port_country_id AS pol_port_country_id")
            .select("pol.port_name AS pol_port_name")
            .select("pol.port_region AS pol_port_region")
            .leftJoin("customer", "customer.cus_id", "rate_table.rate_cus_id")
            .leftJoin("agent", "agent.agent_id", "rate_table.rate_agent_id")
            .leftJoin("carrier", "carrier.cr_id", "rate_table.rate_cr_id")
            .leftJoin({ pod: 'port'}, "pod.port_id", "rate_table.rate_pod_id")
            .leftJoin({ pol: 'port'}, "pol.port_id", "rate_table.rate_pol_id")
            .orderBy("rate_table.rate_timestamp", "desc");

        return rate;
    }

    async exportRateTable(queryParam: RateTableQueryParam): Promise<RateTable[]> {
        const qc = this.getQueryBuilder();

        if(queryParam.rate_date_from) {
            qc.where("rate_table.rate_timestamp", ">=", queryParam.rate_date_from);
        }

        if(queryParam.rate_date_to) {
            qc.where("rate_table.rate_timestamp", "<=", queryParam.rate_date_to);
        }

        qc.select("rate_table.*")
          .select("agent.*")
          .select("carrier.*")
          .select("customer.*")
          .select("pod.port_id AS pod_port_id")
          .select("pod.port_city_id AS pod_port_city_id")
          .select("pod.port_country_id AS pod_port_country_id")
          .select("pod.port_name AS pod_port_name")
          .select("pod.port_region AS pod_port_region")
          .select("pol.port_id AS pol_port_id")
          .select("pol.port_city_id AS pol_port_city_id")
          .select("pol.port_country_id AS pol_port_country_id")
          .select("pol.port_name AS pol_port_name")
          .select("pol.port_region AS pol_port_region")
          .leftJoin("customer", "customer.cus_id", "rate_table.rate_cus_id")
          .leftJoin("agent", "agent.agent_id", "rate_table.rate_agent_id")
          .leftJoin("carrier", "carrier.cr_id", "rate_table.rate_cr_id")
          .leftJoin({ pod: 'port'}, "pod.port_id", "rate_table.rate_pod_id")
          .leftJoin({ pol: 'port'}, "pol.port_id", "rate_table.rate_pol_id")
          .orderBy("rate_table.rate_timestamp", "desc");

        return await qc;
    }

    async updateRateTable(rate_id: string, rateDetail: RateTable): Promise<any> {
        const updateRate = await this.getQueryBuilder()
            .update(rateDetail)
            .where("rate_id", rate_id);
        return updateRate;
    }

    async updateRateLog(rate_id: string, rateDetail: RateTable, user: UserAccount) {
        const log = {
            timestamp: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
            rate_json: JSON.stringify(rateDetail),
            rate_uuid: rate_id,
            user_id: user.user_id,
            fullname: user.user_fullname,
            recommend: rateDetail.rate_recommend
        }
        const updateRateLog = await this.getQueryBuilder("rate_log")
            .insert(log)
        return updateRateLog;
    }

    async disableRateTable(rate_id: string, disable: number): Promise<any> {
        const rateDisable = await this.getQueryBuilder()
            .update({ rate_disable: disable })
            .where("rate_id", rate_id);
        return rateDisable;
    }

    async getCityTable(param? : CityTable): Promise<CityTable[]>{

        const city =  this.getQueryBuilder("city_country")

        if(param && param.cc_disable !== null && param.cc_disable !== undefined) {
            city.where("cc_disable", param.cc_disable)
        }

        city.select("*")
        return await city;
    }

    async addCityTable(city: CityTable): Promise<any> {
        const cityAdd = await this.getQueryBuilder("city_country")
            .insert([city]);
        return cityAdd;
    }

    async updateCity(city_id: string, country_id: string, city: CityTable): Promise<any> {
        const cityUpdate = this.getQueryBuilder("city_country")
            .update(city)
            .where("cc_city_id", city_id)
            .andWhere("cc_country_id", country_id);
        return await cityUpdate;
    }

    async getPort(param?: PortTable): Promise<PortTable[]> {
        const port = this.getQueryBuilder("port")

        if(param && param.port_disable !== null && param.port_disable !== undefined) {
            port.where("port.port_disable", param.port_disable)
        }

        port.select("port.port_id")
            .select("port.port_city_id")
            .select("port.port_country_id")
            .select("city_country.cc_city_name AS port_city_name")
            .select("city_country.cc_country_name AS port_country_name")
            .select("port.port_code")
            .select("port.port_name")
            .select("port.port_region")
            .select("port.port_disable")
            .leftJoin("city_country", function() {
                this.on("port.port_country_id", "city_country.cc_country_id")
                    .andOn("port.port_city_id", "city_country.cc_city_id")
            })
            .groupBy("port.port_id")
            .groupBy("port.port_city_id")
            .groupBy("port.port_country_id")
            .groupBy("city_country.cc_city_name")
            .groupBy("city_country.cc_country_name")
            .groupBy("port.port_code")
            .groupBy("port.port_name")
            .groupBy("port.port_region")
            .groupBy("port.port_disable")
        return await port;
    }

    async addPort(port: PortTable) {
        const portAdd = await this.getQueryBuilder("port")
            .insert([port]);
        return portAdd;
    }

    async updatePort(port_id: string, port: PortTable) {
        const portUpdate = await this.getQueryBuilder("port")
            .update(port)
            .where("port_id", port_id);
        return portUpdate;
    }

    async getTat() {
        const tat = await this.getQueryBuilder("lead_time")
            .select("*")
            .first();
        return tat;
    }

    async updateTat(tat: TatTable) {
        const tatUpdate = await this.getQueryBuilder("lead_time")
            .update(tat)
            .where("lt_id", 1);
        return tatUpdate;
    }
}
