import { IsOptional } from "class-validator";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';

export class RateTable {
    @IsOptional()
    rate_id: string
    rate_pol_id: string
    rate_pod_id: string
    @IsOptional()
    rate_cus_id: string
    @IsOptional()
    rate_inq_no: string
    rate_agent_id: string
    @IsOptional()
    rate_cr_id: string
    @IsOptional()
    rate_recommend: string
    rate_timestamp: string
    rate_valid_from: string
    rate_expired_to: string
    @IsOptional()
    rate_carrier_sc: string
    rate_type: string
    @IsOptional()
    rate_freight_currency: string
    @IsOptional()
    rate_freight_20: number
    @IsOptional()
    rate_freight_40: number
    @IsOptional()
    rate_freight_40hc: number
    @IsOptional()
    rate_freight_cbm: number
    @IsOptional()
    rate_isps_currency: string
    @IsOptional()
    rate_isps_cp_cntr: string
    @IsOptional()
    rate_aea_currency: string
    @IsOptional()
    rate_aea_cp_shpmt: number
    @IsOptional()
    rate_lss_currency: string
    @IsOptional()
    rate_lss_20: number
    @IsOptional()
    rate_lss_40: number
    @IsOptional()
    rate_lss_40hc: number
    @IsOptional()
    rate_remark: string
    @IsOptional()
    rate_sailing_bkk: string
    @IsOptional()
    rate_sailing_lcb: string
    @IsOptional()
    rate_sailing_other: string
    @IsOptional()
    rate_tt: string
    @IsOptional()
    rate_route: string
    @IsOptional()
    rate_ts_port: string
    @IsOptional()
    rate_special_container: string
    @IsOptional()
    rate_disable: number
    rate_input_no: string

    fromExcel(rateExcelRows: any[]) {
        this.rate_id = uuidv4();
        this.rate_pol_id = typeof rateExcelRows[8] === "undefined" ? null : rateExcelRows[8];
        this.rate_pod_id = typeof rateExcelRows[10] === "undefined" ? null : rateExcelRows[10];
        this.rate_cus_id = typeof rateExcelRows[13] === "undefined" ? null : rateExcelRows[13];
        this.rate_inq_no = typeof rateExcelRows[36] === "undefined" ? null : rateExcelRows[36];
        this.rate_agent_id = typeof rateExcelRows[3] === "undefined" ? null : rateExcelRows[3];
        this.rate_cr_id = typeof rateExcelRows[5] === "undefined" ? null : rateExcelRows[5];
        this.rate_recommend = typeof rateExcelRows[4] === "undefined" ? null : rateExcelRows[4];
        this.rate_timestamp = moment(rateExcelRows[2]).format("YYYY-MM-DD");
        this.rate_valid_from = moment(rateExcelRows[6]).format("YYYY-MM-DD");
        this.rate_expired_to = moment(rateExcelRows[7]).format("YYYY-MM-DD");
        this.rate_carrier_sc = typeof rateExcelRows[12] === "undefined" ? null : rateExcelRows[12];
        this.rate_type =  typeof rateExcelRows[14] === "undefined" ? null : rateExcelRows[14];
        this.rate_freight_currency = typeof rateExcelRows[15] === "undefined" ? null : rateExcelRows[15];

        if(rateExcelRows[16] && typeof rateExcelRows[16].result !== "undefined") {
            this.rate_freight_20 = Number(rateExcelRows[16].result.replace(/\s+/g, ''));
        }else if(rateExcelRows[16]) {
            this.rate_freight_20 = typeof rateExcelRows[16] === "undefined" || null ? null : Number(rateExcelRows[16].replace(/\s+/g, ''));
        }else {
            this.rate_freight_20 = null;
        }

        if(rateExcelRows[17] && typeof rateExcelRows[17].result !== "undefined") {
            this.rate_freight_40 = Number(rateExcelRows[17].result.replace(/\s+/g, ''));
        }else if(rateExcelRows[17]){
            this.rate_freight_40 = typeof rateExcelRows[17] === "undefined" || null ? null : Number(rateExcelRows[17].replace(/\s+/g, ''));
        }else {
            this.rate_freight_40 = null;
        }

        if(rateExcelRows[18] && typeof rateExcelRows[18].result !== "undefined") {
            this.rate_freight_40hc = Number(rateExcelRows[18].result.replace(/\s+/g, ''));
        }else if(rateExcelRows[18]){
            this.rate_freight_40hc = typeof rateExcelRows[18] === "undefined" || null ? null : Number(rateExcelRows[18].replace(/\s+/g, ''));
        }else {
            this.rate_freight_40hc = null;
        }

        if(rateExcelRows[19] && typeof rateExcelRows[19].result !== "undefined") {
            this.rate_freight_cbm = Number(rateExcelRows[19].result.replace(/\s+/g, ''));
        }else if(rateExcelRows[19]){
            this.rate_freight_cbm = typeof rateExcelRows[19] === "undefined" || null ? null : Number(rateExcelRows[19].replace(/\s+/g, ''));
        }else {
            this.rate_freight_cbm = null;
        }
        
        this.rate_isps_currency = typeof rateExcelRows[20] === "undefined" ? null : rateExcelRows[20];
        this.rate_isps_cp_cntr = typeof rateExcelRows[21]  === "undefined" ? null : rateExcelRows[21];
        this.rate_aea_currency = typeof rateExcelRows[22] === "undefined" ? null : rateExcelRows[22];;
        this.rate_aea_cp_shpmt = typeof rateExcelRows[23] === "undefined" ? null : rateExcelRows[23];
        this.rate_lss_currency = typeof rateExcelRows[24] === "undefined" ? null : rateExcelRows[24];

        if(rateExcelRows[25] && typeof rateExcelRows[25].result !== "undefined") {
            this.rate_lss_20 = Number(rateExcelRows[25].result.replace(/\s+/g, ''));
        }else if(rateExcelRows[25]){
            this.rate_lss_20 = typeof rateExcelRows[25] === "undefined" || null ? null : Number(rateExcelRows[25].replace(/\s+/g, ''));
        }else {
            this.rate_lss_20 = null;
        }

        if(rateExcelRows[26] && typeof rateExcelRows[26].result !== "undefined") {
            this.rate_lss_40 = Number(rateExcelRows[26].result.replace(/\s+/g, ''));
        }else if(rateExcelRows[26]){
            this.rate_lss_40 = typeof rateExcelRows[26] === "undefined" || null ? null : Number(rateExcelRows[26].replace(/\s+/g, ''));
        }else {
            this.rate_lss_40 = null;
        }

        if(rateExcelRows[27] && typeof rateExcelRows[27].result !== "undefined") {
            this.rate_lss_40hc = Number(rateExcelRows[27].result.replace(/\s+/g, ''));
        }else if(rateExcelRows[27]){
            this.rate_lss_40hc = typeof rateExcelRows[27] === "undefined" || null ? null : Number(rateExcelRows[27].replace(/\s+/g, ''));
        }else {
            this.rate_lss_40hc = null;
        }

        this.rate_remark = typeof rateExcelRows[28] === "undefined" ? null : rateExcelRows[28];
        this.rate_sailing_bkk = typeof rateExcelRows[30] === "undefined" ? null : rateExcelRows[30];
        this.rate_sailing_lcb = typeof rateExcelRows[31] === "undefined" ? null : rateExcelRows[31];
        this.rate_sailing_other = typeof rateExcelRows[32] === "undefined" ? null : rateExcelRows[32];
        this.rate_tt = typeof rateExcelRows[29] === "undefined" ? null : rateExcelRows[29];
        this.rate_route = typeof rateExcelRows[33] === "undefined" ? null : rateExcelRows[33];
        this.rate_ts_port = typeof rateExcelRows[34] === "undefined" ? null : rateExcelRows[34];
        this.rate_special_container = typeof rateExcelRows[35] === "undefined" ? null : rateExcelRows[35];
        this.rate_disable = null;
        this.rate_input_no = typeof rateExcelRows[1] === "undefined" ? null : rateExcelRows[1].replace(/ /g,'');

        return this
    }
}
