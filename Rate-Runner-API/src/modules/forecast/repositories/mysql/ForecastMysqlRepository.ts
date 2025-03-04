import { MysqlRepository } from "app/core/MysqlRepository";
import { Service } from "typedi";
import { Forecast } from "../../models/Forecast";
import { ForecastQueryParam } from "../../models/ForecastQueryParam";
import { ForecastRepositoryToken, IForecastRepository } from "../IForecastRepository";

@Service()
@Service(ForecastRepositoryToken)
export class ForecastMysqlRepository extends MysqlRepository<Forecast> implements IForecastRepository  {
    public tableName: string = "forecast";

    async getForecast(queryParam: ForecastQueryParam) {
        const qc = this.getQueryBuilder();

        if(queryParam.user_id) {
            qc.whereIn("fc_user_id", queryParam.user_id);
        }
        
        if(queryParam.fc_cus_id) {
            qc.where("fc_cus_id", queryParam.fc_cus_id);
        }

        if(queryParam.fc_pod_id) {
            qc.where("fc_pod_id", queryParam.fc_pod_id);
        }

        if(queryParam.fc_pol_id) {
            qc.where("fc_pol_id", queryParam.fc_pol_id);
        }

        if(queryParam.month) {
            qc.whereRaw(`MONTH(fc_timestamp) = ${queryParam.month}`);
        }

        if(queryParam.year) {
            qc.whereRaw(`YEAR(fc_timestamp) = ${queryParam.year}`);
        }

        if(queryParam.timestamp_month) {
            qc.whereRaw(`MONTH(fc_timestamp_no) = ${queryParam.timestamp_month}`);
        }

        if(queryParam.timestamp_year) {
            qc.whereRaw(`YEAR(fc_timestamp_no) = ${queryParam.timestamp_year}`);
        }

        if(queryParam.cargo_readiness_month) {
            qc.whereRaw(`MONTH(fc_cargo_readiness) = ${queryParam.cargo_readiness_month}`);
        }

        if(queryParam.cargo_readiness_year) {
            qc.whereRaw(`YEAR(fc_cargo_readiness) = ${queryParam.cargo_readiness_year}`);
        }

        if(queryParam.fc_cargo_readiness_from) {
            qc.where("fc_cargo_readiness", ">=", queryParam.fc_cargo_readiness_from);
        }

        if(queryParam.fc_cargo_readiness_to) {
            qc.where("fc_cargo_readiness", "<=", queryParam.fc_cargo_readiness_to);
        }

        if(queryParam.last) {
            qc.first();
        }
        
        if(queryParam.filter_customer) {
            qc.whereIn("customer.cus_id", queryParam.filter_customer); 
        }

        qc.select("forecast.*")
          .select("customer.*")
          .select("user.user_fullname")
          .select("user.user_team")
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
          .leftJoin("customer", "customer.cus_id", "forecast.fc_cus_id")
          .leftJoin({ pod: 'port'}, "pod.port_id", "forecast.fc_pod_id")
          .leftJoin({ pol: 'port'}, "pol.port_id", "forecast.fc_pol_id")
          .leftJoin("user", "user.user_id", "forecast.fc_user_id")
          .orderBy("forecast.fc_week_no", "desc");

        return await qc;
    }

    async addForecast(forecast: Forecast[]) {
        const forecastAdd = await this.getQueryBuilder()
            .insert(forecast);
        return forecastAdd;
    }

    async updateForecast(fc_uuid: string, forecast: Forecast) {
        const forecastUpdate = await this.getQueryBuilder()
            .update(forecast)
            .where("fc_uuid", fc_uuid);
        return forecastUpdate;
    }
}
