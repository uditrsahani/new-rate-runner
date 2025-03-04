import { Inject, Service } from "typedi";
import { RateTable } from "../models/RateTable";
import ExcelJS from "exceljs";
import { Readable } from "stream";
import moment from "moment";
import { CityTable } from "../models/CityTable";
import { PortTable } from "../models/PortTable";
import { v4 as uuidv4 } from 'uuid';
import { CityTableRepositoryToken, ICityTableRepository } from "../repositories/ICityTableRepository";
import { IRateTableRepository, RateTableRepositoryToken } from "../repositories/IRateTableRepository";
import { IPortTableRepository, PortTableRepositoryToken } from "../repositories/IPortTableRepository";
import { TatTable } from "../models/TatTable";
import { ITATTableRepository, TATTableRepositoryToken } from "../repositories/ITATTableRepository";
import { RateTableQueryParam } from "../models/RateTableQueryParam";
import { CarrierProfile } from "app/modules/profiles/models/CarrierProfile";
import { CustomerProfile } from "app/modules/profiles/models/CustomerProfile";
import { ProfileService } from "app/modules/profiles/services/ProfileServices";
import { AgentProfile } from "app/modules/profiles/models/AgentProfile";
import { AgentProfileQueryParam } from "app/modules/profiles/models/AgentProfileQueryParam";
import { RateTableConflict } from "../models/RateTableConflict";
import { CustomerProfileQueryParam } from "app/modules/profiles/models/CustomerProfileQueryParam";
import { UserAccount } from "app/modules/auth/models/UserAccount";
import { InquiryService } from "app/modules/inquiry/services/InquiryService";
import { InquiryQueryParam } from "app/modules/inquiry/models/InquiryQueryParam";
import { InquiryRepositoryToken, IInquiryRepository } from "app/modules/inquiry/repositories/IInquiryRepository";
import { Inquiry } from "app/modules/inquiry/models/Inquiry";

@Service()
export class TableService {
    @Inject(RateTableRepositoryToken)
    private rateTableRepository: IRateTableRepository;

    @Inject(CityTableRepositoryToken)
    private cityTableRepository: ICityTableRepository;

    @Inject(PortTableRepositoryToken)
    private portTableRepository: IPortTableRepository;

    @Inject(TATTableRepositoryToken)
    private tatTableRepository: ITATTableRepository;

    @Inject(InquiryRepositoryToken)
    private inquiryRepository: IInquiryRepository;

    @Inject(() => ProfileService)
    private profileService: ProfileService;

    @Inject(() => InquiryService)
    private inquiryService: InquiryService;

    async addRateTable(rate: RateTable) {
        rate.rate_id = uuidv4();
        const rateAdd = await this.rateTableRepository.addRateTable([rate]);
        return rateAdd;
    }

    async addFileRateTable(file: Express.Multer.File, user: UserAccount) {
        try{
            const rate_stream = Readable.from(file.buffer);
            const workbook = new ExcelJS.Workbook();
            const rate_workbook = await workbook.xlsx.read(rate_stream);
            const worksheet = rate_workbook.getWorksheet(1);

            const rateTables: RateTable[] = [];
            const rateInputNo: string[] = [];
            worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
                if(rowNumber > 2) {
                    const plain_row: string[] = [];
                    plain_row.push(null);
                    row.eachCell({ includeEmpty: true }, (cell: ExcelJS.Cell) => {
                        plain_row.push(cell.text === '' ? null : cell.text);
                    });
                    const rate_row = new RateTable().fromExcel(plain_row);
                    rateInputNo.push(rate_row.rate_input_no);
                    rateTables.push(rate_row);
                }
                row.commit();
            });

            const rateConflite: RateTableConflict[] = [];
            const rateDuplicate: RateTable[] = [];
            const rateDuplicateFound = await this.rateTableRepository.getRateTableByNo(rateInputNo);
            if(rateDuplicateFound.length > 0) {
                rateDuplicateFound.forEach((dup) => {
                    rateDuplicate.push(rateTables.find(rate => rate.rate_input_no === dup.rate_input_no));
                    const conflict = new RateTableConflict();
                    conflict.rate_input_no = dup.rate_input_no;
                    conflict.duplicate = true;
                    rateConflite.push(conflict);
                });

                rateDuplicate.forEach((rateDup: RateTable) => {
                    const dupIndex = rateTables.indexOf(rateDup);
                    if (dupIndex > -1) {
                        rateTables.splice(dupIndex, 1);
                    }
                });
            }
            
            const agentsParam = new AgentProfileQueryParam();
            const agents: AgentProfile[] = await this.profileService.getAgent(agentsParam);
            const carriers: CarrierProfile[] = await this.profileService.getCarrier();
            const portParam = new PortTable();
            portParam.port_disable = 0;
            const ports: PortTable[] = await this.getPort(portParam);
            const customers: CustomerProfile[] = await this.profileService.getCustomer(new CustomerProfileQueryParam(), user);

            const rateForAdd: RateTable[] = [];
            rateTables.forEach((row) => {
                row.rate_disable = 0;
                const conflict = new RateTableConflict();
                conflict.rate_input_no = row.rate_input_no;

                agents.forEach((agent) => {
                    if(row.rate_agent_id && row.rate_agent_id.replace(/\s+/g, '')
                    .localeCompare(agent.agent_code.replace(/\s+/g, ''), undefined, { sensitivity: 'accent' }) === 0){
                        row.rate_agent_id = agent.agent_id;
                        conflict.agent_found = true;
                    }
                });

                carriers.forEach((carrier) => {
                    if(row.rate_cr_id && row.rate_cr_id.replace(/\s+/g, '')
                    .localeCompare(carrier.cr_code.replace(/\s+/g, ''), undefined, { sensitivity: 'accent' }) === 0){
                        row.rate_cr_id = carrier.cr_id;
                        conflict.cr_found = true;
                    }
                });

                ports.forEach((port) => {
                    if(row.rate_pol_id && row.rate_pol_id.replace(/\s+/g, '')
                    .localeCompare(port.port_name.replace(/\s+/g, ''), undefined, { sensitivity: 'accent' }) === 0){
                        row.rate_pol_id = port.port_id;
                        conflict.pol_found = true;
                    }
                });

                ports.forEach((port) => {
                    if(row.rate_pod_id && row.rate_pod_id.replace(/\s+/g, '')
                    .localeCompare(port.port_name.replace(/\s+/g, ''), undefined, { sensitivity: 'accent' }) === 0){
                        row.rate_pod_id = port.port_id;
                        conflict.pod_found = true;
                    }
                });

                customers.forEach((customer) => {
                    if(row.rate_cus_id && row.rate_cus_id.replace(/\s+/g, '')
                    .localeCompare(customer.cus_name.replace(/\s+/g, ''), undefined, { sensitivity: 'accent' }) === 0){
                        row.rate_cus_id = customer.cus_id;
                        conflict.cus_found = true;
                    }else if(row.rate_cus_id == null || row.rate_cus_id == "") {
                        row.rate_cus_id = null;
                        conflict.cus_found = true;
                    }
                });

                if(conflict.agent_found &&
                   conflict.cr_found &&
                   conflict.pol_found &&
                   conflict.pod_found &&
                   conflict.cus_found
                  ) {
                    rateForAdd.push(row);
                } else {
                    rateConflite.push(conflict);
                }
            });

            if(rateForAdd.length === 0) {
                return rateConflite;
            } else {
                await this.rateTableRepository.addRateTable(rateForAdd);
                return rateConflite;
            }
        }catch(error) {
            console.log(error);
            throw error;
        }
    }

    async recheckRateInquiry() {
        const inqParam = new InquiryQueryParam();
        inqParam.inq_res_quote_status = "PENDING";
        inqParam.inq_disable = 0;
        inqParam.not_inq_qtn = "SEND";

        const inqs: Inquiry[] = await this.inquiryRepository.getInquiry(inqParam);
        console.log("inqs", inqs.length);

        await this.inquiryService.calInqRate(inqs);
    }

    async getRateTable(queryParam: RateTableQueryParam) {
        const now = moment().utcOffset(7).format("YYYY-MM-DD");
        queryParam.rate_expired_to = now;
        const rate = await this.rateTableRepository.getRateTable(queryParam);
        return rate;
    }

    async getExportRateTable(queryParam: RateTableQueryParam) {
        const rates: any[] = await this.rateTableRepository.exportRateTable(queryParam);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Rate Table');

        worksheet.insertRow(1, ["Rate NO.", "POL", "POD", "Customer", "Inquiry NO.",
            "Agent", "Carrier", "Recommend", "Timestamp", "From", "To", "Carrier SC", "Type", 
            "Freight Currency", "Freight 20`", "Freight 40`", "Freight 40`HC", "Freight CBM", 
            "LSS Currency", "LSS 20`", "LSS 40`", "LSS 40`HC", "LSS CBM", 
            "ISPS Currency", "ISPS Change per CNTR", 
            "AEA Currency", "AEA Change per SHPT",
            "Remark", "Saling BKK", "Saling LCD", "Saling Other", 
            "T/T", "ROUTE", "T/S PORT", "Special Container", "Disable"]);

        rates.forEach((rate: any, index) => {
            const row: any[] = [
                rate.rate_input_no,
                rate.pol_port_name,
                rate.pod_port_name,
                rate.cus_name,
                rate.rate_inq_no,
                rate.agent_name,
                rate.cr_name,
                rate.rate_recommend,
                moment(rate.rate_timestamp).format('DD/MM/yyyy'),
                moment(rate.rate_valid_from).format('DD/MM/yyyy'),
                moment(rate.rate_expired_to).format('DD/MM/yyyy'),
                rate.rate_carrier_sc,
                rate.rate_type,
                rate.rate_freight_currency,
                rate.rate_freight_20,
                rate.rate_freight_40,
                rate.rate_freight_40hc,
                rate.rate_freight_cbm,
                rate.rate_lss_currency,
                rate.rate_lss_20,
                rate.rate_lss_40,
                rate.rate_lss_40hc,
                rate.rate_lss_cbm,
                rate.rate_isps_currency,
                rate.rate_isps_cp_cntr,
                rate.rate_aea_currency,
                rate.rate_aea_cp_shpmt,
                rate.rate_remark,
                rate.rate_sailing_bkk,
                rate.rate_sailing_lcb,
                rate.rate_sailing_other,
                rate.rate_tt,
                rate.rate_route,
                rate.rate_ts_port,
                rate.rate_special_container,
                rate.rate_disable ? "True" : "False"
            ];

            worksheet.insertRow(index + 2, row);
        });

        this.columnWidthOptimize(worksheet, [27, 34]);
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    async exportExcel(sheetName: string, header: string[], data: any[][], workbook?: ExcelJS.Workbook) {

        if(!workbook) {
            workbook = new ExcelJS.Workbook();
        }

        const worksheet = workbook.addWorksheet(sheetName);

        worksheet.insertRow(1, header);

        data.forEach((row: any, index) => {
            worksheet.insertRow(index + 2, row);
        });

        this.columnWidthOptimize(worksheet);
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).font = { bold: true };

        return workbook;
    }

    columnWidthOptimize(worksheet: ExcelJS.Worksheet, exceptCol?: number[]) {
        worksheet.columns.forEach((column, index) => {
            if(exceptCol && exceptCol.find(except => except === index)) {
                column.width = 10;
                return;
            }

            let maxLength = 0;
                column["eachCell"]({ includeEmpty: true }, (cell) => {
                    let columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength ) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength < 10 ? 10 : maxLength;
        });
    }

    async updateRateTable(rate_id: string, rateDetail: RateTable, user: UserAccount) {
        delete rateDetail.rate_id;
        delete rateDetail.rate_input_no;
        const updateRate = await this.rateTableRepository.updateRateTable(rate_id, rateDetail);
        await this.rateTableRepository.updateRateLog(rate_id, rateDetail, user);
        return updateRate;
    }

    async disableRateTable(rate_id: string, disable: number) {
        const rateDisable = await this.rateTableRepository.disableRateTable(rate_id, disable);
        return rateDisable;
    }

    async getCity() {
        const city = this.cityTableRepository.getCityTable();
        return city;
    }

    async exportCity() {
        const citys = await this.getCity();

        const header: string[] = [
            "Country Code",
            "Country Name",
            "City Code",
            "City Name",
            "Trade",
            "Disable"
        ];
        
        const data: string[][] = []

        citys.forEach((city) => {
            const row = [
                city.cc_country_id,
                city.cc_country_name,
                city.cc_city_id,
                city.cc_city_name,
                city.cc_trade,
                city.cc_disable ? "True" : "False"
            ];
            data.push(row);
        });

        const excel = await this.exportExcel('City & Country', header, data);
        const buffer = await excel.xlsx.writeBuffer();
        return buffer;
    }

    async addCity(city: CityTable) {
        const cityAdd = this.cityTableRepository.addCityTable(city);
        return cityAdd;
    }

    async updateCity(city_id: string, country_id: string, city: CityTable) {
        delete city.cc_city_id;
        delete city.cc_country_id;
        const cityUpdate = this.cityTableRepository.updateCity(city_id, country_id, city);
        return cityUpdate;
    }

    async getPort(param?: PortTable) {
        const port = await this.portTableRepository.getPort(param);
        return port;
    }

    async exportPort() {
        const ports = await this.getPort();

        const header: string[] = [
            "Port Code",
            "Port Name",
            "City Code",
            "City Name",
            "Country Code",
            "Country Name",
            "Region Code",
            "Disable"
        ];
        
        const data: string[][] = []

        ports.forEach((port) => {
            const row = [
                port.port_code,
                port.port_name,
                port.port_city_id,
                port.port_city_name,
                port.port_country_id,
                port.port_country_name,
                port.port_region,
                port.port_disable ? "True" : "False"
            ];
            data.push(row);
        });

        const excel = await this.exportExcel('Port', header, data);
        const buffer = await excel.xlsx.writeBuffer();
        return buffer
    }

    async addPort(port: PortTable) {
        port.port_id = uuidv4();
        const portAdd = await this.portTableRepository.addPort(port);
        return portAdd;
    }

    async updatePort(port_id: string, port: PortTable) {
        delete port.port_id;
        const portUpdate = await this.portTableRepository.updatePort(port_id, port);
        return portUpdate;
    }

    async getTat() {
        const tat = await this.tatTableRepository.getTat();
        tat.lt_timestamp = moment(tat.lt_timestamp).utcOffset(7).format("YYYY-MM-DD")
        return tat;
    }

    async updateTat(tat: TatTable) {
        delete tat.lt_id;
        if(!tat.lt_timestamp) {
            const datetime = moment().utcOffset(7).format('YYYY-MM-DD');
            tat.lt_timestamp = datetime;
        }
        const tatUpdate = await this.tatTableRepository.updateTat(tat);
        return tatUpdate;
    }
}
