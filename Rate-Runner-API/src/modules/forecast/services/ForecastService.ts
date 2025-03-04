import { Inject, Service } from "typedi";
import { Forecast } from "../models/Forecast";
import { ForecastRepositoryToken, IForecastRepository } from "../repositories/IForecastRepository";
import { v4 as uuidv4 } from 'uuid';
import { ForecastQueryParam } from "../models/ForecastQueryParam";
import moment from "moment";
import numeral from "numeral";
import ExcelJS from "exceljs";
import { UserAccount } from "app/modules/auth/models/UserAccount";
import { UserRepository, IUserRepository } from "app/modules/auth/repositories/IUserRepository";
import { UserAccountQueryParam } from "app/modules/auth/models/UserAccountQueryParam";
import { LeaderWorkerService } from "app/modules/leader/services/LeaderWorkerService";

@Service()
export class ForecastService {

    @Inject(ForecastRepositoryToken)
    private forecastRepository: IForecastRepository;
    
    @Inject(UserRepository)
    private userRepository: IUserRepository;

    @Inject(() => LeaderWorkerService)
    private leaderWorkerService: LeaderWorkerService;

    async getForecast(queryParam: ForecastQueryParam, user: UserAccount) {
        queryParam.user_id = await this.salesSelfFilter(user);
        const forecast = await this.forecastRepository.getForecast(queryParam);
        return forecast;
    }

    async reportMonthlyForecast(queryParam: ForecastQueryParam, user: UserAccount) {
        const forecasts: any[] = await this.getForecast(queryParam, user);

        const reportForecast: any[] = [];
        forecasts.forEach((forecast: any) => {
            const row = {
                fc_timestamp: forecast.fc_timestamp,
                fc_week_no: forecast.fc_week_no,
                user_fullname: forecast.user_fullname,
                user_team: forecast.user_team,
                cus_name: forecast.cus_name,
                fc_factory_location: forecast.fc_factory_location,
                fc_incoterms: forecast.fc_incoterms,
                fc_mode: forecast.fc_mode,
                fc_place_of_receipt: forecast.fc_place_of_receipt,
                pol_port_name: forecast.pol_port_name,
                pod_port_name: forecast.pod_port_name,
                fc_final_destination: forecast.fc_final_destination,
                fc_type: forecast.fc_type,
                fc_container_20: forecast.fc_container_20,
                fc_container_40: forecast.fc_container_40,
                fc_container_40hc: forecast.fc_container_40hc,
                fc_container_cbm: forecast.fc_container_cbm,
                fc_commodity: forecast.fc_commodity,
                fc_qw_per_cntr: forecast.fc_qw_per_cntr,
                fc_cargo_readiness: forecast.fc_cargo_readiness,
                fc_revernue: forecast.fc_revernue,
                fc_gp: forecast.fc_gp
            }

            reportForecast.push(row);
        });

        return reportForecast;
    }

    async exportMonthlyForecast(queryParam: ForecastQueryParam, user: UserAccount) {       
        const reportRows = await this.getForecast(queryParam, user);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Monthly Sales Forecast');

        worksheet.insertRow(1, ["Date", "Week No.", "Sales", "Sales Team", "Customer",
         "Factory Location", "Incoterm", "Mode", "Place of Receive", "POL", "POD", 
         "Final Destination", "Type", "20'", "40'", "40' HC", "CBM", "Commodity", 
         "GW Per CNTR (Kg)", "Cargo Readness", "Revenue (USD)", "G/P (USD)"]);

        let fc_revernue_sum = 0;
        let fc_gp_sum = 0;

         let currentRow = 1;
         reportRows.forEach((row: any) => {
             if(Object.values(row)[0] && Object.values(row)[0] !== "") {
                 let rowArr = [
                    row.fc_timestamp,
                    row.fc_week_no,
                    row.user_fullname,
                    row.user_team,
                    row.cus_name,
                    row.fc_factory_location,
                    row.fc_incoterms,
                    row.fc_mode,
                    row.fc_place_of_receipt,
                    row.pol_port_name,
                    row.pod_port_name,
                    row.fc_final_destination,
                    row.fc_type,
                    row.fc_container_20,
                    row.fc_container_40,
                    row.fc_container_40hc,
                    row.fc_container_cbm,
                    row.fc_commodity,
                    row.fc_qw_per_cntr,
                    row.fc_cargo_readiness,
                    row.fc_revernue,
                    row.fc_gp
                 ];
                 worksheet.insertRow(++currentRow, rowArr);

                 fc_revernue_sum += Number(row.fc_revernue);
                 fc_gp_sum += Number(row.fc_gp);
             }
         });

         worksheet.insertRow(2, [
             "Summary",
             "","","","","","","","","","","","","","","","","","","",
             fc_revernue_sum.toFixed(2),
             fc_gp_sum.toFixed(2)
         ]);
 
         worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
         worksheet.getRow(1).font = { bold: true };
         this.columnWidthOptimize(worksheet);
 
         const buffer = await workbook.xlsx.writeBuffer();
         return buffer;
    }

    async addForecast(forecasts: Forecast[]) {
        const queryParam = new ForecastQueryParam();
        const month = Number(moment().utcOffset(7).format('MM'));
        const year = Number(moment().utcOffset(7).format('YY'));
        queryParam.timestamp_month = Number(moment().utcOffset(7).format('M'));
        queryParam.timestamp_year = Number(moment().utcOffset(7).format('YYYY'));
        const forecast_set = await this.forecastRepository.getForecast(queryParam);
        const count = forecast_set.length;

        forecasts.forEach((forecast, i) => {
            forecast.fc_uuid = uuidv4();
            forecast.fc_timestamp_no = moment().utcOffset(7).format('YYYY-MM-DD HH:mm:ss');
            const fcNumber = numeral(count + i + 1).format('0000');
            const formatedMonth = numeral(month).format('00');
            forecast.fc_no = `FC${year}${formatedMonth}${fcNumber}`;
        });
        
        const forecastAdd = await this.forecastRepository.addForecast(forecasts);
        return forecastAdd;
    }

    async updateForecast(fc_uuid: string, forecast: Forecast) {
        delete forecast.fc_uuid;
        delete forecast.fc_no;
        const forecastUpdate = await this.forecastRepository.updateForecast(fc_uuid, forecast);
        return forecastUpdate;
    }

    columnWidthOptimize(worksheet: ExcelJS.Worksheet) {
        worksheet.columns.forEach((column) => {
            var maxLength = 0;
            column["eachCell"]({ includeEmpty: true }, function (cell) {
                var columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength ) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength;
        }); 
    }

    async salesOwnerCust(user: UserAccount): Promise<string[]> {
        if(user) {
            switch(user.user_role) {
                case "sales": {
                    const cust_id: any[] = await this.userRepository.getUserCustOwner(user.user_id);
                    const ids: string[] = ["00000000-0000-0000-0000-000000000000"];
                    cust_id.map((cust) => {
                        if(cust.cus_id) {
                            ids.push(cust.cus_id);
                        }
                    });
                    return ids;
                }
                default: return null;
            }
        } else {
            return null
        }
    }

    async salesSelfFilter(user: UserAccount) {
        switch(user.user_role) {
            case "seniorManager": {
                const user_param = new UserAccountQueryParam();
                user_param.user_team = user.user_team;
                const users_in_team = await this.userRepository.getAllUser(user_param);
                const user_id_in_team = users_in_team.map((user) => { return user.user_id});
                return user_id_in_team;
            }
            case "salesManager": {
                if(user.user_team === "BD") {
                    const user_param = new UserAccountQueryParam();
                    user_param.user_team = user.user_team;
                    const users_in_team = await this.userRepository.getAllUser(user_param);
                    const user_id_in_team = users_in_team.map((user) => { return user.user_id});
                    return user_id_in_team;
                } else {
                    const user_worker = await this.leaderWorkerService.getLeaderWorker(user.user_id);
                    const user_id_worker = user_worker.map((worker) => { return worker.worker_user_id });
                    return [...user_id_worker, user.user_id];
                }
            }
            case "sales": {
                if(user.user_team === "BD") {
                    const user_param = new UserAccountQueryParam();
                    user_param.user_team = user.user_team;
                    const users_in_team = await this.userRepository.getAllUser(user_param);
                    const user_id_in_team = users_in_team.map((user) => { return user.user_id});
                    return user_id_in_team;
                } else {
                    return [user.user_id];
                }
            }
            default: return null;
        }
    }
}
