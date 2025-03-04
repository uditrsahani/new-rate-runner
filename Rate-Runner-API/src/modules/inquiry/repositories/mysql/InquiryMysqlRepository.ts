import { MysqlRepository } from "app/core/MysqlRepository";
import { TableService } from "app/modules/tables/services/TableServices";
import { Inject, Service } from "typedi";
import { Inquiry } from "../../models/Inquiry";
import { InquiryQueryParam } from "../../models/InquiryQueryParam";
import { InquiryRate } from "../../models/InquiryRate";
import { IquiryReportQueryParam } from "../../models/InquiryReportQueryParam";
import { IInquiryRepository, InquiryRepositoryToken } from "../IInquiryRepository";

@Service()
@Service(InquiryRepositoryToken)
export class InquiryMysqlRepository extends MysqlRepository<Inquiry> implements IInquiryRepository {
    public tableName: string = "inquiry";

    @Inject(() => TableService)
    private tableService: TableService;

    async getInquiryMinimize(queryParam: InquiryQueryParam) {
        const qc = this.getQueryBuilder();

        if(queryParam.user_id) {
            qc.whereIn("inq_user_id", queryParam.user_id);
        }
        
        if(queryParam.inq_cus_id) {
            qc.where("inq_cus_id", queryParam.inq_cus_id);
        }

        if(queryParam.inq_pod_id) {
            qc.where("inq_pod_id", queryParam.inq_pod_id);
        }

        if(queryParam.inq_pol_id) {
            qc.where("inq_pol_id", queryParam.inq_pol_id);
        }

        if(queryParam.inq_qtn) {
            qc.where("inq_qtn", queryParam.inq_qtn);
        }

        if(queryParam.inq_status) {
            qc.where("inq_status", queryParam.inq_status);
        }

        if(queryParam.inq_user_id) {
            qc.where("inq_user_id", queryParam.inq_user_id);
        }

        if(queryParam.inq_uuid) {
            qc.where("inq_uuid", queryParam.inq_uuid);
        }

        if(queryParam.month) {
            qc.whereRaw(`MONTH(inq_date) = ${queryParam.month}`);
        }

        if(queryParam.year) {
            qc.whereRaw(`YEAR(inq_date) = ${queryParam.year}`);
        }

        if(queryParam.last) {
            qc.first();
        }

        if(queryParam.inq_date_from) {
            qc.where("inq_date", ">=", queryParam.inq_date_from);
        }

        if(queryParam.inq_date_to) {
            qc.where("inq_date", "<=", queryParam.inq_date_to);
        }

        if(queryParam.inq_mode) {
            qc.where("inq_mode", queryParam.inq_mode);
        }

        if(queryParam.inq_type) {
            qc.where("inq_type", queryParam.inq_type);
        }

        if(queryParam.inq_res_quote_status) {
            qc.where("inq_res_quote_status", queryParam.inq_res_quote_status);
        }

        if(queryParam.order_by) {
            qc.orderBy(queryParam.order_by);
        }else{
            qc.orderBy("inq_no", "desc");
        }

        if(queryParam.timestamp_month) {
            qc.whereRaw(`MONTH(inq_timestamp) = ${queryParam.timestamp_month}`);
        }

        if(queryParam.timestamp_year) {
            qc.whereRaw(`YEAR(inq_timestamp) = ${queryParam.timestamp_year}`);
        }

        if(queryParam.inq_disable) {
            qc.where("inq_disable", queryParam.inq_disable);
        }

        if(queryParam.filter_customer) {
            qc.whereIn("customer.cus_id", queryParam.filter_customer);
        }

        if(queryParam.not_inq_qtn) {
            qc.andWhere("inq_qtn", "<>", queryParam.not_inq_qtn)
        }
        
        const inq = qc
            .select("inquiry.inq_disable")
            .select("inquiry.inq_qtn")
            .select("inquiry.inq_uuid")
            .select("inquiry.inq_no")
            .select("inquiry.inq_status")
            .select("inquiry.inq_waiting_mktg")
            .select("inquiry.inq_cargo_readiness")
            .select("inquiry.inq_date")
            .select("inquiry.inq_pod_id")
            .select("inquiry.inq_pol_id")
            .select("inquiry.inq_cus_id")
            .select("inquiry.inq_waiting_mktg")
            .select("inquiry.inq_waiting_sales")
            .select("inquiry.inq_waiting_cus")
            .select("inquiry.inq_waiting_quotation")
            .select("customer.cus_name")
            .select("user.user_id")
            .select("user.user_fullname")
            .select("user.user_team")
            .select("pod.port_name AS pod_port_name")
            .select("pol.port_name AS pol_port_name")
            .leftJoin("customer", "customer.cus_id", "inquiry.inq_cus_id")
            .leftJoin("user", "user.user_id", "inquiry.inq_user_id")
            .leftJoin({ pod: 'port'}, "pod.port_id", "inquiry.inq_pod_id")
            .leftJoin({ pol: 'port'}, "pol.port_id", "inquiry.inq_pol_id")
    
        return await inq;
    }

    async getInquiryDashboardStatus(queryParam: InquiryQueryParam) {
        const qc = this.getQueryBuilder();

        if(queryParam.user_id) {
            qc.whereIn("inq_user_id", queryParam.user_id);
        }
        
        if(queryParam.inq_cus_id) {
            qc.where("inq_cus_id", queryParam.inq_cus_id);
        }

        if(queryParam.inq_pod_id) {
            qc.where("inq_pod_id", queryParam.inq_pod_id);
        }

        if(queryParam.inq_pol_id) {
            qc.where("inq_pol_id", queryParam.inq_pol_id);
        }

        if(queryParam.inq_qtn) {
            qc.where("inq_qtn", queryParam.inq_qtn);
        }

        if(queryParam.inq_status) {
            qc.where("inq_status", queryParam.inq_status);
        }

        if(queryParam.inq_user_id) {
            qc.where("inq_user_id", queryParam.inq_user_id);
        }

        if(queryParam.inq_uuid) {
            qc.where("inq_uuid", queryParam.inq_uuid);
        }

        if(queryParam.month) {
            qc.whereRaw(`MONTH(inq_date) = ${queryParam.month}`);
        }

        if(queryParam.year) {
            qc.whereRaw(`YEAR(inq_date) = ${queryParam.year}`);
        }

        if(queryParam.last) {
            qc.first();
        }

        if(queryParam.inq_date_from) {
            qc.where("inq_date", ">=", queryParam.inq_date_from);
        }

        if(queryParam.inq_date_to) {
            qc.where("inq_date", "<=", queryParam.inq_date_to);
        }

        if(queryParam.inq_mode) {
            qc.where("inq_mode", queryParam.inq_mode);
        }

        if(queryParam.inq_type) {
            qc.where("inq_type", queryParam.inq_type);
        }

        if(queryParam.inq_res_quote_status) {
            qc.where("inq_res_quote_status", queryParam.inq_res_quote_status);
        }

        if(queryParam.order_by) {
            qc.orderBy(queryParam.order_by);
        }else{
            qc.orderBy("inq_no", "desc");
        }

        if(queryParam.timestamp_month) {
            qc.whereRaw(`MONTH(inq_timestamp) = ${queryParam.timestamp_month}`);
        }

        if(queryParam.timestamp_year) {
            qc.whereRaw(`YEAR(inq_timestamp) = ${queryParam.timestamp_year}`);
        }

        if(queryParam.inq_disable) {
            qc.where("inq_disable", queryParam.inq_disable);
        }

        if(queryParam.filter_customer) {
            qc.whereIn("customer.cus_id", queryParam.filter_customer);
        }

        if(queryParam.not_inq_qtn) {
            qc.andWhere("inq_qtn", "<>", queryParam.not_inq_qtn)
        }

        const inq = qc
            .select("inquiry.inq_disable")
            .select("inquiry.inq_no")
            .select("inquiry.inq_date")
            .select("inquiry.inq_status")
            .select("inquiry.inq_tx_time")
            .select("inquiry.inq_revenue")
            .select("inquiry.inq_uuid")
            .select("inquiry.inq_mode")
            .select("inquiry.inq_waiting_mktg")
            .select("inquiry.inq_waiting_sales")
            .select("inquiry.inq_waiting_cus")
            .select("inquiry.inq_waiting_quotation")
            .select("inquiry.inq_res_quote_status")
            .select("user.user_id")
            .select("user.user_fullname")
            .select("customer.cus_name")
            .select("customer.cus_id")
            .select("customer.cus_type")
            .select("pod.port_name AS pod_port_id")
            .select("pol.port_name AS pol_port_id")
            .select("pod.port_name AS pod_port_name")
            .select("pol.port_name AS pol_port_name")
            .leftJoin("customer", "customer.cus_id", "inquiry.inq_cus_id")
            .leftJoin("user", "user.user_id", "inquiry.inq_user_id")
            .leftJoin({ pod: 'port'}, "pod.port_id", "inquiry.inq_pod_id")
            .leftJoin({ pol: 'port'}, "pol.port_id", "inquiry.inq_pol_id")
    
        return await inq;
    }

    async getInquiry(queryParam: InquiryQueryParam) {

        const qc = this.getQueryBuilder();

        if(queryParam.user_id) {
            qc.whereIn("inq_user_id", queryParam.user_id);
        }
        
        if(queryParam.inq_cus_id) {
            qc.where("inq_cus_id", queryParam.inq_cus_id);
        }

        if(queryParam.inq_pod_id) {
            qc.where("inq_pod_id", queryParam.inq_pod_id);
        }

        if(queryParam.inq_pol_id) {
            qc.where("inq_pol_id", queryParam.inq_pol_id);
        }

        if(queryParam.inq_qtn) {
            qc.where("inq_qtn", queryParam.inq_qtn);
        }

        if(queryParam.inq_status) {
            qc.where("inq_status", queryParam.inq_status);
        }

        if(queryParam.inq_user_id) {
            qc.where("inq_user_id", queryParam.inq_user_id);
        }

        if(queryParam.inq_uuid) {
            qc.where("inq_uuid", queryParam.inq_uuid);
        }

        if(queryParam.month) {
            qc.whereRaw(`MONTH(inq_date) = ${queryParam.month}`);
        }

        if(queryParam.year) {
            qc.whereRaw(`YEAR(inq_date) = ${queryParam.year}`);
        }

        if(queryParam.last) {
            qc.first();
        }

        if(queryParam.inq_date_from) {
            qc.where("inq_date", ">=", queryParam.inq_date_from);
        }

        if(queryParam.inq_date_to) {
            qc.where("inq_date", "<=", queryParam.inq_date_to);
        }

        if(queryParam.inq_mode) {
            qc.where("inq_mode", queryParam.inq_mode);
        }

        if(queryParam.inq_type) {
            qc.where("inq_type", queryParam.inq_type);
        }

        if(queryParam.inq_res_quote_status) {
            qc.where("inq_res_quote_status", queryParam.inq_res_quote_status);
        }

        if(queryParam.order_by) {
            qc.orderBy(queryParam.order_by);
        }else{
            qc.orderBy("inq_no", "desc");
        }

        if(queryParam.timestamp_month) {
            qc.whereRaw(`MONTH(inq_timestamp) = ${queryParam.timestamp_month}`);
        }

        if(queryParam.timestamp_year) {
            qc.whereRaw(`YEAR(inq_timestamp) = ${queryParam.timestamp_year}`);
        }

        if(queryParam.inq_disable) {
            qc.where("inq_disable", queryParam.inq_disable);
        }

        if(queryParam.joinForecast) {
            qc.select("forecast.*")
              .leftJoin("forecast", "forecast.fc_inq_uuid", "inquiry.inq_uuid")
              .groupBy("forecast.fc_uuid")
              .groupBy("inquiry.inq_uuid")
              .groupBy("agent_quote.aq_id")
        }

        if(queryParam.filter_customer) {
            qc.whereIn("customer.cus_id", queryParam.filter_customer);
        }

        if(queryParam.not_inq_qtn) {
            qc.andWhere("inq_qtn", "<>", queryParam.not_inq_qtn)
        }

        const inq = qc
            .select("inquiry.*")
            .select("rate_table.*")
            .select("customer.*")
            .select("agent_quote.*")
            .select("agent.*")
            .select("carrier.*")
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
            .select("pol.port_city_id")
            .select("pol.port_country_id")
            .select("cc_pol.cc_city_name AS pol_cc_city_name")
            .select("cc_pol.cc_country_name AS pol_cc_country_name")
            .select("cc_pod.cc_city_name AS pod_cc_city_name")
            .select("cc_pod.cc_country_name AS pod_cc_country_name")
            .joinRaw(`LEFT JOIN agent_quote 
                      ON agent_quote.aq_inq_no = inquiry.inq_uuid
                      AND agent_quote.aq_select = 's'`)
            .leftJoin("rate_table", "rate_table.rate_id", "inquiry.inq_rate_id")
            .leftJoin("customer", "customer.cus_id", "inquiry.inq_cus_id")
            .leftJoin("user", "user.user_id", "inquiry.inq_user_id")
            .leftJoin("carrier", "carrier.cr_id", "rate_table.rate_cr_id")
            .leftJoin({ pod: 'port'}, "pod.port_id", "inquiry.inq_pod_id")
            .leftJoin({ pol: 'port'}, "pol.port_id", "inquiry.inq_pol_id")
            .leftJoin({ cc_pol: 'city_country'}, function() {
                this.on("cc_pol.cc_city_id", "pol.port_city_id")
                    .andOn("cc_pol.cc_country_id", "pol.port_country_id")
            })
            .leftJoin({ cc_pod: 'city_country'}, function() {
                this.on("cc_pod.cc_city_id", "pod.port_city_id")
                    .andOn("cc_pod.cc_country_id", "pod.port_country_id")
            })
            .leftJoin("agent", "agent.agent_id", "rate_table.rate_agent_id")
    
        return await inq;
    }

    async getInquiryReportTop(params: IquiryReportQueryParam) {
        const inqReport = this.getQueryBuilder();

        if(params.user_id) {
            inqReport.whereIn("inq_user_id", params.user_id);
        }

        if(params.inq_date_from) {
            inqReport.where("inq_date", ">=", params.inq_date_from);
        }

        if(params.inq_date_to) {
            inqReport.where("inq_date", "<=", params.inq_date_to);
        }

        if(params.inq_status) {
            inqReport.where("inquiry.inq_status", params.inq_status);
        }

        if(params.inq_disable) {
            inqReport.where("inq_disable", params.inq_disable);
        }

        if(params.inq_res_quote_status === "PENDING") {
            inqReport.where("inquiry.inq_res_quote_status", params.inq_res_quote_status)
        }
        else if(params.inq_res_quote_status === "WIN" || params.inq_res_quote_status === "LOSS") {
            inqReport.where("inquiry.inq_res_quote_status", params.inq_res_quote_status)
                     .where("inquiry.inq_res_quote_status", "!=", "PENDING");
        }

        switch(params.group) {
            case "sales": {
                inqReport.select("user.user_fullname")
                         .leftJoin("user", "inquiry.inq_user_id", "user.user_id")
                         .groupBy("inquiry.inq_user_id")
                         .groupBy("user.user_fullname")
                break;
            }
            case "pol": {
                inqReport.select("port.port_name")
                         .leftJoin("port", "inquiry.inq_pol_id", "port.port_id")
                         .groupBy("inquiry.inq_pol_id")
                         .groupBy("port.port_name")
                break;
            }
            case "pod": {
                inqReport.select("port.port_name")
                         .leftJoin("port", "inquiry.inq_pod_id", "port.port_id")
                         .groupBy("inquiry.inq_pod_id")
                         .groupBy("port.port_name")
                break;
            }
            case "carrier": {
                inqReport.select("carrier.cr_name")
                         .leftJoin("rate_table", "rate_table.rate_id", "inquiry.inq_rate_id")
                         .leftJoin("carrier", "carrier.cr_id", "rate_table.rate_cr_id")
                         .groupBy("carrier.cr_name")
                break;
            }
            case "key": {
                inqReport.where("customer.cus_type", "key")
            }
            case "customer": 
            default: {
                inqReport.select("customer.cus_name")
                         .leftJoin("customer", "inquiry.inq_cus_id", "customer.cus_id")
                         .groupBy("inquiry.inq_cus_id")
                         .groupBy("customer.cus_name")
                break;
            }
        }
        
        inqReport.count("inquiry.inq_uuid", {as: 'inq_count'})
                 .sum("inquiry.inq_revenue", {as: 'inq_revenue_sum'})
                 .sum("inquiry.inq_gp", {as: 'inq_gp_sum'})
                 .select(
                  this.knex.raw(`((SUM(inquiry.inq_gp) / SUM(inquiry.inq_revenue)) * 100) AS inq_ros`)
                 ,this.knex.raw(`
                        SUM(IF(inquiry.inq_res_quote_status = 'WIN', 1, 0)) AS win_count,
                        SUM(IF(inquiry.inq_res_quote_status = 'WIN', inquiry.inq_revenue, 0)) AS win_revenue_sum,
                        SUM(IF(inquiry.inq_res_quote_status = 'WIN', inquiry.inq_gp, 0)) AS win_gp_sum,
                        SUM(IF(inquiry.inq_res_quote_status = 'WIN', (inquiry.inq_gp / inquiry.inq_revenue) * 100, 0)) AS win_ros`)
                 ,this.knex.raw(`
                        SUM(IF(inquiry.inq_res_quote_status = 'LOSS', 1, 0)) AS loss_count,
                        SUM(IF(inquiry.inq_res_quote_status = 'LOSS', inquiry.inq_revenue, 0)) AS loss_revenue_sum,
                        SUM(IF(inquiry.inq_res_quote_status = 'LOSS', inquiry.inq_gp, 0)) AS loss_gp_sum,
                        SUM(IF(inquiry.inq_res_quote_status = 'LOSS', (inquiry.inq_gp / inquiry.inq_revenue) * 100, 0)) AS loss_ros`)
                 )
                 .where("inquiry.inq_res_quote_status", "!=", "PENDING")
                 .where("inquiry.inq_status", "close")
                 .orderBy("win_gp_sum", "desc")
                 .limit(10)

        const result: any[] = await inqReport;
        return result;
    }

    async getInquiryReportSale(params: IquiryReportQueryParam) {
        const inqReportSale = this.getQueryBuilder();

        if(params.user_id) {
            inqReportSale.whereIn("inq_user_id", params.user_id);
        }

        switch(params.group) {
            case "sub": {
                inqReportSale.select("customer.cus_type")
                             .groupBy("customer.cus_type")
                             .orderBy("cus_type");
            }
            case "main": {
                inqReportSale.select("user.user_team")
                             .groupBy("user.user_team");
                break;
            }
        }

        if(params.inq_date_from) {
            inqReportSale.where("inq_date", ">=", params.inq_date_from);
        }

        if(params.inq_date_to) {
            inqReportSale.where("inq_date", "<=", params.inq_date_to);
        }

        if(params.user_team) {
            inqReportSale.where("user.user_team", params.user_team);
        }

        inqReportSale.select(this.knex.raw(`
                        COUNT(*) AS count,
                        SUM(
                            IF(inquiry.inq_disable = 1, 0,
                                IF(inquiry.inq_res_quote_status = 'WIN', 1, 0))
                            )      AS win,
                        SUM(
                            IF(inquiry.inq_disable = 1, 0,
                                IF(inquiry.inq_res_quote_status = 'LOSS', 1, 0))
                            )     AS loss,
                        SUM(
                            IF(inquiry.inq_disable = 1, 0,
                                IF(inquiry.inq_res_quote_status = 'PENDING', 1, 0))
                            )  AS pending,
                        SUM(
                            IF(inquiry.inq_disable = 1, 1, 0)) AS disable
                      `))
                     .leftJoin("user", "user.user_id", "inquiry.inq_user_id")
                     .leftJoin("customer", "customer.cus_id", "inquiry.inq_cus_id")

        return await inqReportSale;
    }

    async getInquiryReportActual(queryParam: IquiryReportQueryParam) {
        const inqReportActualLeft = this.getQueryBuilder();
        const inqReportActualRight = this.getQueryBuilder();

        inqReportActualLeft
                       .select("*")
                       .from("forecast")
                       .leftJoin("inquiry", "inquiry.inq_uuid", "forecast.fc_inq_uuid")
                       .union(
                        inqReportActualRight.select("*")
                          .from("forecast")
                          .rightJoin("inquiry", "inquiry.inq_uuid", "forecast.fc_inq_uuid")
                       )
                       .where(function() {
                           this.where("inq_res_quote_status", "<>", "PENDING")
                               .orWhere("inq_res_quote_status", null)
                       })
                       .where(function() {
                           this.where("inq_res_quote_status", "<>", "PENDING")
                               .orWhere("inq_res_quote_status", null)
                       })

        if(queryParam.user_id) {
            inqReportActualLeft.whereIn("inquiry.inq_user_id", queryParam.user_id)
                               .orWhereIn("forecast.fc_user_id", queryParam.user_id);
            inqReportActualRight.whereIn("inquiry.inq_user_id", queryParam.user_id)
                                .orWhereIn("forecast.fc_user_id", queryParam.user_id);
        }
          
        const inqReportActual = await inqReportActualLeft;
        return inqReportActual;
    }

    async getInquiryReportKey(queryParam: IquiryReportQueryParam) {
        const inqReportKey = this.getQueryBuilder();

        if(queryParam.user_id) {
            inqReportKey.whereIn("inq_user_id", queryParam.user_id);
        }

        if(queryParam.inq_cus_id) {
            inqReportKey.where("inquiry.inq_cus_id", queryParam.inq_cus_id);
        }

        if(queryParam.year) {
            inqReportKey.whereRaw(`YEAR(inquiry.inq_date) = ${queryParam.year}`)
        }

        if(queryParam.inq_disable) {
            inqReportKey.where("inquiry.inq_disable", queryParam.inq_disable);
        }

        if(queryParam.inq_status) {
            inqReportKey.where("inquiry.inq_status", queryParam.inq_status);
        }

        inqReportKey
            .select("customer.cus_name")
            .sum("inquiry.inq_revenue AS inq_revenue_sum")
            .sum("inquiry.inq_gp AS inq_gp_sum")
            .select(this.knex.raw(`
                SUM(IF(MONTH(inquiry.inq_date) = 1, inquiry.inq_revenue, 0)) AS month_1_revenue,
                SUM(IF(MONTH(inquiry.inq_date) = 1, inquiry.inq_gp, 0))      AS month_1_gp,
                SUM(IF(MONTH(inquiry.inq_date) = 2, inquiry.inq_revenue, 0)) AS month_2_revenue,
                SUM(IF(MONTH(inquiry.inq_date) = 2, inquiry.inq_gp, 0))      AS month_2_gp,
                SUM(IF(MONTH(inquiry.inq_date) = 3, inquiry.inq_revenue, 0)) AS month_3_revenue,
                SUM(IF(MONTH(inquiry.inq_date) = 3, inquiry.inq_gp, 0))      AS month_3_gp,
                SUM(IF(MONTH(inquiry.inq_date) = 4, inquiry.inq_revenue, 0)) AS month_4_revenue,
                SUM(IF(MONTH(inquiry.inq_date) = 4, inquiry.inq_gp, 0))      AS month_4_gp,
                SUM(IF(MONTH(inquiry.inq_date) = 5, inquiry.inq_revenue, 0)) AS month_5_revenue,
                SUM(IF(MONTH(inquiry.inq_date) = 5, inquiry.inq_gp, 0))      AS month_5_gp,
                SUM(IF(MONTH(inquiry.inq_date) = 6, inquiry.inq_revenue, 0)) AS month_6_revenue,
                SUM(IF(MONTH(inquiry.inq_date) = 6, inquiry.inq_gp, 0))      AS month_6_gp,
                SUM(IF(MONTH(inquiry.inq_date) = 7, inquiry.inq_revenue, 0)) AS month_7_revenue,
                SUM(IF(MONTH(inquiry.inq_date) = 7, inquiry.inq_gp, 0))      AS month_7_gp,
                SUM(IF(MONTH(inquiry.inq_date) = 8, inquiry.inq_revenue, 0)) AS month_8_revenue,
                SUM(IF(MONTH(inquiry.inq_date) = 8, inquiry.inq_gp, 0))      AS month_8_gp,
                SUM(IF(MONTH(inquiry.inq_date) = 9, inquiry.inq_revenue, 0)) AS month_9_revenue,
                SUM(IF(MONTH(inquiry.inq_date) = 9, inquiry.inq_gp, 0))      AS month_9_gp,
                SUM(IF(MONTH(inquiry.inq_date) = 10, inquiry.inq_revenue, 0)) AS month_10_revenue,
                SUM(IF(MONTH(inquiry.inq_date) = 10, inquiry.inq_gp, 0))      AS month_10_gp,
                SUM(IF(MONTH(inquiry.inq_date) = 11, inquiry.inq_revenue, 0)) AS month_11_revenue,
                SUM(IF(MONTH(inquiry.inq_date) = 11, inquiry.inq_gp, 0))      AS month_11_gp,
                SUM(IF(MONTH(inquiry.inq_date) = 12, inquiry.inq_revenue, 0)) AS month_12_revenue,
                SUM(IF(MONTH(inquiry.inq_date) = 12, inquiry.inq_gp, 0))      AS month_12_gp`
            ))
            .leftJoin("customer", "customer.cus_id", "inquiry.inq_cus_id")
            .where("customer.cus_type", "key")
            .andWhere("inq_res_quote_status", "WIN")
            .groupBy("customer.cus_name")
            .orderBy("inq_gp_sum", "desc")
 
        return await inqReportKey;
    }

    async getInquiryReportCustomer(queryParam: IquiryReportQueryParam) {
        const inqReportCustomer = this.getQueryBuilder();

        if(queryParam.user_id) {
            inqReportCustomer.whereIn("inq_user_id", queryParam.user_id);
        }

        if(queryParam.cus_type) {
            inqReportCustomer.where("customer.cus_type", queryParam.cus_type);
        }

        if(queryParam.inq_res_quote_status) {
            inqReportCustomer.where("inquiry.inq_res_quote_status", queryParam.inq_res_quote_status);
        }

        if(queryParam.inq_disable) {
            inqReportCustomer.where("inq_disable", queryParam.inq_disable);
        }

        if(queryParam.inq_date_from) {
            inqReportCustomer.where("inq_date", ">=", queryParam.inq_date_from);
        }

        if(queryParam.inq_date_to) {
            inqReportCustomer.where("inq_date", "<=", queryParam.inq_date_to);
        }

        inqReportCustomer
            .select("customer.cus_type")
            .select("customer.cus_name")
            .select("inquiry.inq_no")
            .select("user.user_fullname")
            .select("user.user_team")
            .select("inquiry.inq_mode")
            .select("inquiry.inq_incoterms")
            .select("pol.port_name AS pol_port_name")
            .select("pod.port_name AS pod_port_name")
            .select("carrier.cr_name")
            .select("inquiry.inq_commodity")
            .select("inquiry.inq_type")
            .select("inquiry.inq_container_20")
            .select("inquiry.inq_container_40")
            .select("inquiry.inq_container_40hc")
            .select("inquiry.inq_container_cbm")
            .select("inquiry.inq_revenue")
            .select("inquiry.inq_gp")
            .select("inquiry.inq_qtn")
            .select("inquiry.inq_res_quote_status")
            .leftJoin("rate_table", "rate_table.rate_id", "inquiry.inq_rate_id")
            .leftJoin("customer", "customer.cus_id", "inquiry.inq_cus_id")
            .leftJoin("user", "user.user_id", "inquiry.inq_user_id")
            .leftJoin({ pod: 'port'}, "pod.port_id", "inquiry.inq_pod_id")
            .leftJoin({ pol: 'port'}, "pol.port_id", "inquiry.inq_pol_id")
            .leftJoin("carrier", "carrier.cr_id", "rate_table.rate_cr_id")
            .orderBy("inquiry.inq_gp", "desc")

        return await inqReportCustomer;
    }

    async getInquiryReportTopCustomer(queryParam: IquiryReportQueryParam) {
        const inqReportTopCustomer = this.getQueryBuilder();

        if(queryParam.user_id) {
            inqReportTopCustomer.whereIn("inq_user_id", queryParam.user_id);
        }

        if(queryParam.inq_date_from) {
            inqReportTopCustomer.where("inquiry.inq_date", ">=", queryParam.inq_date_from);
        }

        if(queryParam.inq_date_to) {
            inqReportTopCustomer.where("inquiry.inq_date", "<=", queryParam.inq_date_to);
        }

        if(queryParam.inq_disable) {
            inqReportTopCustomer.where("inquiry.inq_disable", queryParam.inq_disable);
        }

        if(queryParam.inq_status) {
            inqReportTopCustomer.where("inquiry.inq_status", queryParam.inq_status);
        }

        inqReportTopCustomer.select("customer.cus_name")
                            .select("user.user_fullname")
                            .count("*", {as: "inq_count"})
                            .select(this.knex.raw(
                                `SUM(inquiry.inq_container_20) + 
                                 SUM(inquiry.inq_container_40) + 
                                 SUM(inquiry.inq_container_40hc) AS container_count`
                            ))
                            .sum("inquiry.inq_revenue", {as: "inq_revenue_sum"})
                            .sum("inquiry.inq_gp", {as: "inq_gp_sum"})
                            .leftJoin("customer", "customer.cus_id", "inquiry.inq_cus_id")
                            .leftJoin("user", "user.user_id", "inquiry.inq_user_id")
                            .where("inq_res_quote_status", "WIN")
                            .groupBy("customer.cus_name")
                            .groupBy("user.user_fullname")
                            .orderBy("inq_gp_sum", "desc")
                            .limit(10)

        return await inqReportTopCustomer;
    }

    async getInquiryReportBooking(queryParam: IquiryReportQueryParam) {
        const inqReportBooking = this.getQueryBuilder();

        if(queryParam.user_id) {
            inqReportBooking.whereIn("inquiry.inq_user_id", queryParam.user_id);
        }

        if(queryParam.inq_res_quote_status) {
            inqReportBooking.where("inquiry.inq_res_quote_status", queryParam.inq_res_quote_status);
        }

        if(queryParam.inq_date_from) {
            inqReportBooking.where("inquiry.inq_date", ">=", queryParam.inq_date_from);
        }

        if(queryParam.inq_date_to) {
            inqReportBooking.where("inquiry.inq_date", "<=", queryParam.inq_date_to);
        }

        if(queryParam.inq_mode) {
            inqReportBooking.where("inquiry.inq_mode", queryParam.inq_mode);
        }

        if(queryParam.inq_pol_id) {
            inqReportBooking.where("inq_pol_id", queryParam.inq_pol_id);
        }

        if(queryParam.inq_pod_id) {
            inqReportBooking.where("inq_pod_id", queryParam.inq_pod_id);
        }

        if(queryParam.inq_cargo_readiness_from) {
            inqReportBooking.where("inquiry.inq_cargo_readiness", ">=", queryParam.inq_cargo_readiness_from);
        }

        if(queryParam.inq_cargo_readiness_to) {
            inqReportBooking.where("inquiry.inq_cargo_readiness", "<=", queryParam.inq_cargo_readiness_to);
        }

        inqReportBooking.select("inquiry.inq_uuid")
                        .select("inquiry.inq_qw_per_cntr")
                        .select("inquiry.inq_res_comment")
                        .select("inquiry.inq_status")
                        .select("inquiry.inq_tx_time")
                        .select("inquiry.inq_timestamp")
                        .select("inquiry.inq_no")
                        .select("inquiry.inq_cargo_readiness")
                        .select("inquiry.inq_revenue")
                        .select("inquiry.inq_gp")
                        .select("customer.cus_name")
                        .select("user.user_fullname")
                        .select("inquiry.inq_mode")
                        .select("pol.port_name AS pol_port_name")
                        .select("pod.port_name AS pod_port_name")
                        .select("inquiry.inq_commodity")
                        .select("inquiry.inq_type")
                        .select("inquiry.inq_container_20")
                        .select("inquiry.inq_container_40")
                        .select("inquiry.inq_container_40hc")
                        .select("inquiry.inq_container_cbm")
                        .select("inquiry.inq_res_quote_status")
                        .leftJoin({ pol: 'port'}, "pol.port_id", "inquiry.inq_pol_id")
                        .leftJoin({ pod: 'port'}, "pod.port_id", "inquiry.inq_pod_id")
                        .leftJoin("customer", "customer.cus_id", "inquiry.inq_cus_id")
                        .leftJoin("user", "user.user_id", "inquiry.inq_user_id")
                        .orderBy("inquiry.inq_tx_time", "desc")

        return await inqReportBooking;
    }

    async getRateInquiry(queryParam: InquiryQueryParam) {
        const inqRate = this.getQueryBuilder("inq_rate");

        if(queryParam.rate_recommend) {
            inqRate.where("inq_rate.rate_recommend", queryParam.rate_recommend);
        }

        if(queryParam.inq_uuid) {
            inqRate.where("inq_rate.inq_uuid", queryParam.inq_uuid);
        }

        inqRate.select("inq_rate.*")
               .select("agent.*")
               .select("carrier.*")
               .select("customer.*")
               .select("rate_table.*")
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
               .leftJoin("rate_table", "rate_table.rate_id", "inq_rate.rate_id")
               .leftJoin("customer", "customer.cus_id", "rate_table.rate_cus_id")
               .leftJoin("agent", "agent.agent_id", "rate_table.rate_agent_id")
               .leftJoin("carrier", "carrier.cr_id", "rate_table.rate_cr_id")
               .leftJoin({ pod: 'port'}, "pod.port_id", "rate_table.rate_pod_id")
               .leftJoin({ pol: 'port'}, "pol.port_id", "rate_table.rate_pol_id")
               .orderBy("rate_table.rate_timestamp", "desc");

        return await inqRate;
    }

    async addRateInquiry(inqRate: InquiryRate[]) {
        const inq = this.getQueryBuilder("inq_rate");

        inq.insert(inqRate)
           .onConflict(["inq_uuid", "inq_rate_uuid"])
           .ignore();

        return await inq;
    }

    async deleteRateInquiry(inq_uuid: string, inq_rate: InquiryRate) {
        const inq = this.getQueryBuilder("inq_rate");

        inq.del()
           .where("inq_uuid", inq_uuid)
           .andWhere("rate_id", inq_rate.rate_id)

        return await inq;
    }

    async addInquiry(inq: Inquiry) {
        const inqAdd = await this.getQueryBuilder()
            .insert([inq])
        return inqAdd;
    }

    async updateInquiry(inq_uuid: string, inq: Inquiry) {
        const inqUpdate = await this.getQueryBuilder()
            .update(inq)
            .where("inq_uuid", inq_uuid);
        return inqUpdate;
    }

    async updateStatusInquiry(inq_uuid: string, inq_status: string) {
        const tat = await this.tableService.getTat();
        const inqUpdate = await this.getQueryBuilder()
            .update({ inq_status: inq_status })
            .where("inq_uuid", inq_uuid);

        switch(inq_status) {
            case "waiting sales": {
                await this.getQueryBuilder()
                    .update({ inq_waiting_sales: tat.lt_waiting_sales })
                    .where("inq_uuid", inq_uuid);
                break;
            }
            case "waiting marketing": {
                await this.getQueryBuilder()
                    .update({ inq_waiting_mktg: tat.lt_waiting_mktg })
                    .where("inq_uuid", inq_uuid);
                break;
            }
            case "waiting customer": {
                await this.getQueryBuilder()
                    .update({ inq_waiting_cus: tat.lt_waiting_cus })
                    .where("inq_uuid", inq_uuid);
                break;
            }
            case "waiting quotation": {
                await this.getQueryBuilder()
                    .update({ inq_waiting_quotation: tat.lt_waiting_quotation })
                    .where("inq_uuid", inq_uuid);
                break;
            }
        }

        return inqUpdate;
    }

    async updateQtnStatusInquiry(inq_uuid: string, inq_qtn: string) {
        const inqUpdate = await this.getQueryBuilder()
            .update({ inq_qtn: inq_qtn })
            .where("inq_uuid", inq_uuid);
        return inqUpdate;
    }
}