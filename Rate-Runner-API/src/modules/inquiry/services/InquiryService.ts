import { Inject, Service } from "typedi";
import { Inquiry } from "../models/Inquiry";
import { InquiryQueryParam } from "../models/InquiryQueryParam";
import { IInquiryRepository, InquiryRepositoryToken } from "../repositories/IInquiryRepository";
import { v4 as uuidv4 } from 'uuid';
import { TransactionService } from "app/modules/transaction/services/TransactionService";
import { Transaction } from "app/modules/transaction/models/Transaction";
import moment from "moment";
import numeral from "numeral";
import ExcelJS, { Fill } from "exceljs";
import { IquiryReportQueryParam } from "../models/InquiryReportQueryParam";
import { SaleReportSub } from "../models/SaleReportSub";
import { SaleReport } from "../models/SaleReport";
import { TableService } from "app/modules/tables/services/TableServices";
import { PortTable } from "app/modules/tables/models/PortTable";
import { UserAccount } from "app/modules/auth/models/UserAccount";
import { UserRepository, IUserRepository } from "app/modules/auth/repositories/IUserRepository";
import { CustomerProfile } from "app/modules/profiles/models/CustomerProfile";
import { CustomerProfileQueryParam } from "app/modules/profiles/models/CustomerProfileQueryParam";
import { ProfileService } from "app/modules/profiles/services/ProfileServices";
import { UserAccountQueryParam } from "app/modules/auth/models/UserAccountQueryParam";
import { CustomerOwnerService } from "app/modules/profiles/services/CustomerOwnerService";
import { LeaderWorkerService } from "app/modules/leader/services/LeaderWorkerService";
import { InquiryRate } from "../models/InquiryRate";
import { RateTableQueryParam } from "app/modules/tables/models/RateTableQueryParam";
import { RateTable } from "app/modules/tables/models/RateTable";
import { RateTableRepositoryToken, IRateTableRepository } from "app/modules/tables/repositories/IRateTableRepository";
import { ForbiddenError, NotAcceptableError } from "routing-controllers";
import { TATTableRepositoryToken, ITATTableRepository } from "app/modules/tables/repositories/ITATTableRepository";

@Service()
export class InquiryService {

    @Inject(InquiryRepositoryToken)
    private inquiryRepository: IInquiryRepository;

    @Inject(() => TransactionService)
    private transactionService: TransactionService;

    @Inject(() => TableService)
    private tableService: TableService;

    @Inject(UserRepository)
    private userRepository: IUserRepository;

    @Inject(() => ProfileService)
    private profileService: ProfileService;

    @Inject(() => CustomerOwnerService)
    private customerOwnerService: CustomerOwnerService;

    @Inject(() => LeaderWorkerService)
    private leaderWorkerService: LeaderWorkerService;

    @Inject(RateTableRepositoryToken)
    private rateTableRepository: IRateTableRepository;

    @Inject(TATTableRepositoryToken)
    private tatTableRepository: ITATTableRepository;

    async getInquiry(queryParam: InquiryQueryParam, user: UserAccount) {
        queryParam.user_id = await this.salesSelfFilter(user);
        let inqs

        if(queryParam.minimize) {
            inqs = await this.inquiryRepository.getInquiryMinimize(queryParam)
        }
        else if(queryParam.dash_status) {
            inqs = await this.inquiryRepository.getInquiryDashboardStatus(queryParam)
        } else {
            inqs = await this.inquiryRepository.getInquiry(queryParam);
        }

        const leadtime = await this.tatTableRepository.getTat();

        inqs.forEach((inq) => {
            switch(inq.inq_status) {
                case "waiting marketing": {
                    inq.inq_day = Math.abs(inq.inq_waiting_mktg);
                    if(inq.inq_day <= leadtime.lt_waiting_mktg) {
                        inq.over_leadtime = false;
                    } else {
                        inq.over_leadtime = true;
                    }
                    break;
                }
                case "waiting sales": {
                    inq.inq_day = Math.abs(inq.inq_waiting_sales);
                    if(inq.inq_day <= leadtime.lt_waiting_sales) {
                        inq.over_leadtime = false;
                    } else {
                        inq.over_leadtime = true;
                    }
                    break;
                }
                case "waiting customer": {
                    inq.inq_day = Math.abs(inq.inq_waiting_cus);
                    if(inq.inq_day <= leadtime.lt_waiting_cus) {
                        inq.over_leadtime = false;
                    } else {
                        inq.over_leadtime = true;
                    }
                    break;
                }
                case "waiting quotation": {
                    inq.inq_day = Math.abs(inq.inq_waiting_quotation);
                    if(inq.inq_day <= leadtime.lt_waiting_quotation) {
                        inq.over_leadtime = false;
                    } else {
                        inq.over_leadtime = true;
                    }
                    break;
                }
                default: {
                    inq.inq_day = null;
                    inq.over_leadtime = null;
                }
            }

            if(queryParam.minimize || queryParam.dash_status) {
                delete inq.inq_waiting_mktg
                delete inq.inq_waiting_sales
                delete inq.inq_waiting_cus
                delete inq.inq_waiting_quotation
            }
        });

        return inqs;
    }

    async exportInquiryReportPerformance(params: InquiryQueryParam, user: UserAccount) {
        params.user_id = await this.salesSelfFilter(user);
        const reportRows = await this.getInquiry(params, user);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inquiry Performance Report');

        worksheet.insertRow(1, ['','','','','','','','','','','','','','',
                                'Volume Per Week', '']);
        // worksheet.insertRow(2, ['Result', 'Inquiry Status', 'Inquiry No.', 'Revenue', 'GP', 'ROS(%)',
        //                         'Customer', 'Sales', 'Team', 'Mode', 'Cargo Readiness','Inquiry Date','Idea Rate Per Unit','Res Comment','Term', 'POL', 'POL Country', 'POL Region',
        //                         'POD', 'POD Country', 'POD Region', 'DEST','Commodity',
        //                         'Type', '20\'', '40\'', '40\' HC', 'CBM', 'Special Container']);

        worksheet.insertRow(2, ['Inquiry Date', 'Inquiry Week No.', 'Last Update', 'Cargo Readiness', 'Result', 'Inquiry Status', 'Inquiry No.', 'Revenue',
                                'GP', 'ROS(%)', 'Customer', 'Sales', 'Team','Mode','Idea Rate Per Unit','Term', 'POL', 'POL Country', 'POL Region',
                                'POD', 'POD Country', 'POD Region', 'DEST','Commodity',
                                'Type', '20\'', '40\'', '40\' HC', 'CBM', 'Special Container', 'Res Comment']);

        let currentRow = 2;

        let inq_revenue_summary = 0;
        let inq_gp_summary = 0;
        let inq_ros_summary = "";

        // reportRows.forEach((row: any) => {
        //     if(Object.values(row)[0] && Object.values(row)[0] !== "") {
        //         let cal_inq_ros = row.inq_gp / row.inq_revenue * 100;
        //         let inq_ros = cal_inq_ros ? cal_inq_ros.toFixed(2) : "";
        //         let rowArr = [
        //             row.inq_disable === 1 ? "Disable" : row.inq_res_quote_status ,
        //             row.inq_status,
        //             row.inq_no,
        //             row.inq_revenue,
        //             row.inq_gp,
        //             inq_ros,
        //             row.cus_name,
        //             row.user_fullname,
        //             row.user_team,
        //             row.inq_mode,
        //             row.inq_cargo_readiness,
        //             row.inq_date,
        //             row.inq_idea_rate_per_unit,
        //             row.inq_res_comment,
        //             row.inq_incoterms,
        //             row.pol_port_name,
        //             row.pol_cc_country_name,
        //             row.pol_port_region,
        //             row.pod_port_name,
        //             row.pod_cc_country_name,
        //             row.pod_port_region,
        //             row.inq_final_destination,
        //             row.inq_commodity,
        //             row.rate_type,
        //             row.inq_container_20,
        //             row.inq_container_40,
        //             row.inq_container_40hc,
        //             row.inq_container_cbm,
        //             row.inq_special_container
        //         ];

        //         inq_revenue_summary += Number(row.inq_revenue);
        //         inq_gp_summary += Number(row.inq_gp);

        //         worksheet.insertRow(++currentRow, rowArr);
        //     }
        // });

        reportRows.forEach((row: any) => {
            if(Object.values(row)[0] && Object.values(row)[0] !== "") {
                let cal_inq_ros = row.inq_gp / row.inq_revenue * 100;
                let inq_ros = cal_inq_ros ? cal_inq_ros.toFixed(2) : "";
                let rowArr = [
                    row.inq_date,
                    row.inq_res_actual_week_no,
                    row.inq_tx_time,
                    row.inq_cargo_readiness,
                    row.inq_disable === 1 ? "Disable" : row.inq_res_quote_status ,
                    row.inq_status,
                    row.inq_no,
                    row.inq_revenue,
                    row.inq_gp,
                    inq_ros,
                    row.cus_name,
                    row.user_fullname,
                    row.user_team,
                    row.inq_mode,
                    row.inq_idea_rate_per_unit,
                    row.inq_incoterms,
                    row.pol_port_name,
                    row.pol_cc_country_name,
                    row.pol_port_region,
                    row.pod_port_name,
                    row.pod_cc_country_name,
                    row.pod_port_region,
                    row.inq_final_destination,
                    row.inq_commodity,
                    row.rate_type,
                    row.inq_container_20,
                    row.inq_container_40,
                    row.inq_container_40hc,
                    row.inq_container_cbm,
                    row.inq_special_container,
                    row.inq_res_comment
                ];

                inq_revenue_summary += Number(row.inq_revenue);
                inq_gp_summary += Number(row.inq_gp);

                worksheet.insertRow(++currentRow, rowArr);
            }
        });

        let cal_sum_inq_ros = inq_gp_summary / inq_revenue_summary * 100;
        inq_ros_summary = cal_sum_inq_ros ? cal_sum_inq_ros.toFixed(2) : "";

        worksheet.insertRow(3, ["Summary", "", "", inq_revenue_summary.toFixed(2), inq_gp_summary.toFixed(2), inq_ros_summary ]);

        worksheet.mergeCells('O1:S1');

        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(2).font = { bold: true };

        this.columnWidthOptimize(worksheet);

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    async getInquiryReportTop(params: IquiryReportQueryParam, user: UserAccount) {
        params.user_id = await this.salesSelfFilter(user);
        const report = this.inquiryRepository.getInquiryReportTop(params);
        return report;
    }

    async exportInquiryReportTop(params: IquiryReportQueryParam, user: UserAccount) {
        params.user_id = await this.salesSelfFilter(user);
        const reportRows = await this.getInquiryReportTop(params, user);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Top 10 Report');
        worksheet.insertRow(1, ['', 'All Inquiry', '', '', '', 'Win Inquiry', '', '', '', 'Loss Inquiry']);

        let reportHead = '';
        switch(params.group) {
            case "sales": {
                reportHead = "Sales";
                break;
            }
            case "pol": {
                reportHead = "POL";
                break;
            }
            case "pod": {
                reportHead = "POD";
                break;
            }
            case "carrier": {
                reportHead = "Carrier";
                break;
            }
            case "key": {
                reportHead = "Key Customer";
                break;
            }
            case "customer": {
                reportHead = "Customer";
                break;
            }
        }

        worksheet.insertRow(2, [reportHead,
                                'No. of Inquiry', 'Revenue', 'GP', 'ROS(%)',
                                'No. of Inquiry', 'Revenue', 'GP', 'ROS(%)',
                                'No. of Inquiry', 'Revenue', 'GP', 'ROS(%)' ]);
        let currentRow = 2;

        let inq_revenue_summary = 0;
        let inq_gp_summary = 0;
        let inq_ros_summary = "";

        let win_revenue_summary = 0;
        let win_gp_summary = 0;
        let win_ros_summary = "";

        let loss_revenue_summary = 0;
        let loss_gp_summary = 0;
        let loss_ros_summary = "";

        reportRows.forEach((row: any) => {
            if(Object.values(row)[0] && Object.values(row)[0] !== "") {
                let cal_inq_ros = row.inq_gp_sum / row.inq_revenue_sum * 100;
                row.inq_ros = cal_inq_ros ? cal_inq_ros.toFixed(2) : "";
                let cal_win_ros = row.win_gp_sum / row.win_revenue_sum * 100;
                row.win_ros = cal_win_ros ? cal_win_ros.toFixed(2) : "";
                let cal_loss_ros= row.loss_gp_sum / row.loss_revenue_sum * 100;
                row.loss_ros = cal_loss_ros ? cal_loss_ros.toFixed(2) : "";

                inq_revenue_summary += Number(row.inq_revenue_sum);
                inq_gp_summary += Number(row.inq_gp_sum);

                win_revenue_summary += Number(row.win_revenue_sum);
                win_gp_summary += Number(row.win_gp_sum);

                loss_revenue_summary += Number(row.loss_revenue_sum);
                loss_gp_summary += Number(row.loss_gp_sum);

                worksheet.insertRow(++currentRow, Object.values(row));
            }
        });

        let cal_sum_inq_ros = inq_gp_summary / inq_revenue_summary * 100;
        inq_ros_summary = cal_sum_inq_ros ? cal_sum_inq_ros.toFixed(2) : "";
        let cal_sum_win_ros = win_gp_summary / win_revenue_summary * 100;
        win_ros_summary = cal_sum_win_ros ? cal_sum_win_ros.toFixed(2) : "";
        let cal_sum_loss_ros= loss_gp_summary / loss_revenue_summary * 100;
        loss_ros_summary = cal_sum_loss_ros ? cal_sum_loss_ros.toFixed(2) : "";

        worksheet.insertRow(3, ["Summary", "", inq_revenue_summary.toFixed(2), inq_gp_summary.toFixed(2), inq_ros_summary ,
                                           "", win_revenue_summary.toFixed(2), win_gp_summary.toFixed(2), win_ros_summary ,
                                           "", loss_revenue_summary.toFixed(2), loss_gp_summary.toFixed(2), loss_ros_summary ]);

        worksheet.mergeCells('B1:E1');
        worksheet.mergeCells('F1:I1');
        worksheet.mergeCells('J1:M1');

        this.columnWidthOptimize(worksheet);

        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(2).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    async getInquiryReportSale(params: IquiryReportQueryParam, user: UserAccount) {
        params.user_id = await this.salesSelfFilter(user);
        params.group = "main";
        const inqReportSaleMain: SaleReportSub[] = await this.inquiryRepository.getInquiryReportSale(params);
        params.group = "sub";
        const inqReportSaleSub: SaleReportSub[] = await this.inquiryRepository.getInquiryReportSale(params);
        const resultBody: SaleReport[] = [];

        inqReportSaleMain.forEach((main: SaleReportSub, index: number) => {
            const report = new SaleReport();
            const reportDummy = new SaleReportSub();
            reportDummy.user_team = null;
            reportDummy.count = null;
            reportDummy.win = null;
            reportDummy.loss = null;
            reportDummy.pending = null;
            reportDummy.disable = null;

            report.head = main;
            reportDummy.cus_type = "current";
            report.current = reportDummy;
            reportDummy.cus_type = "key";
            report.key = reportDummy;
            reportDummy.cus_type = "new";
            report.new = reportDummy;

            inqReportSaleSub.forEach((sub: SaleReportSub) => {
                if(report.head.user_team === sub.user_team) {
                    switch(sub.cus_type) {
                        case "current": {
                            report.current = sub;
                            break;
                        }
                        case "key": {
                            report.key = sub;
                            break;
                        }
                        case "new": {
                            report.new = sub;
                            break;
                        }
                    }
                }
            });
            resultBody.push(report);
        });

        return resultBody;
    }

    async exportInquiryReportSale(params: IquiryReportQueryParam, user: UserAccount) {
        params.user_id = await this.salesSelfFilter(user);
        const reportRows = await this.getInquiryReportSale(params, user);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Performance Report');

        worksheet.insertRow(1, ['Team', 'No. of Inquiry', '%', 'Win', 'Win%', 'Loss',
                                'Loss%', 'Pending', 'Pending%', 'Disable', 'Disable%']);

        let currentRow = 1;
        let countAll = 0;
        let countWin = 0;
        let countLoss = 0;
        let countPending = 0;
        let countDisable = 0;

        reportRows.forEach((report: SaleReport) => {
            countAll += Number(report.head.count);
            countWin += Number(report.head.win);
            countLoss += Number(report.head.loss);
            countPending += Number(report.head.pending);
            countDisable += Number(report.head.disable);
        });

        let percentAll = ((countAll / countAll) * 100)? (countAll / countAll * 100).toFixed(2) : "";
        let percentWin = ((countWin / countAll) * 100)? (countWin / countAll * 100).toFixed(2) : "";
        let percentLoss = ((countLoss / countAll) * 100)? (countLoss / countAll * 100).toFixed(2) : "";
        let percentPending = ((countPending / countAll) * 100)? (countPending / countAll * 100).toFixed(2) : "";
        let percentDisable = ((countDisable / countAll) * 100)? (countDisable / countAll * 100).toFixed(2) : "";

        const rowFill: Fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'66B2FF'}
        }

        reportRows.forEach((report: SaleReport) => {
            if(report.head.user_team && report.head.user_team !== "") {
                let objArr = [
                    report.head.user_team,
                    report.head.count && report.head.count != 0 ? report.head.count : "",
                    ((report.head.count / countAll) * 100)? (report.head.count / countAll * 100).toFixed(2) : "",
                    report.head.win && report.head.win != 0 ? report.head.win : "",
                    ((report.head.win / report.head.count) * 100)? (report.head.win / report.head.count * 100).toFixed(2) : "",
                    report.head.loss && report.head.loss != 0? report.head.loss : "",
                    ((report.head.loss / report.head.count) * 100)? (report.head.loss / report.head.count * 100).toFixed(2) : "",
                    report.head.pending && report.head.pending != 0? report.head.pending : "",
                    ((report.head.pending / report.head.count) * 100)? (report.head.pending / report.head.count * 100).toFixed(2) : "",
                    report.head.disable && report.head.disable != 0? report.head.disable : "",
                    ((report.head.disable / report.head.count) * 100)? (report.head.disable / report.head.count * 100).toFixed(2) : "",
                ];

                worksheet.insertRow(++currentRow, objArr);
                const row = worksheet.getRow(currentRow);
                row.eachCell((cell, colNumber) => { if(colNumber <= 11) row.getCell(colNumber).fill = rowFill });

                objArr = [
                    "CURRENT",
                    report.current.count && report.current.count != 0? report.current.count : "",
                    "",
                    report.current.win && report.current.win != 0? report.current.win : "",
                    ((report.current.win / report.current.count) * 100)? (report.current.win / report.current.count * 100).toFixed(2) : "",
                    report.current.loss && report.current.loss != 0? report.current.loss : "",
                    ((report.current.loss / report.current.count) * 100)? (report.current.loss / report.current.count * 100).toFixed(2) : "",
                    report.current.pending && report.current.pending != 0? report.current.pending : "",
                    ((report.current.pending / report.current.count) * 100)? (report.current.pending / report.current.count * 100).toFixed(2) : "",
                    report.current.disable && report.current.disable != 0? report.current.disable : "",
                    ((report.current.disable / report.current.count) * 100)? (report.current.disable / report.current.count * 100).toFixed(2) : "",
                ];

                worksheet.insertRow(++currentRow, objArr);

                objArr = [
                    "KEY",
                    report.key.count && report.key.count != 0? report.key.count : "",
                    "",
                    report.key.win && report.key.win != 0? report.key.win : "",
                    ((report.key.win /  report.key.count) * 100)? (report.key.win /  report.key.count * 100).toFixed(2) : "",
                    report.key.loss && report.key.loss != 0? report.key.loss : "",
                    ((report.key.loss /  report.key.count) * 100)? (report.key.loss /  report.key.count * 100).toFixed(2) : "",
                    report.key.pending && report.key.pending != 0? report.key.pending : "",
                    ((report.key.pending /  report.key.count) * 100)? (report.key.pending /  report.key.count * 100).toFixed(2) : "",
                    report.key.disable && report.key.disable != 0? report.key.disable : "",
                    ((report.key.disable /  report.key.count) * 100)? (report.key.disable /  report.key.count * 100).toFixed(2) : "",
                ];

                worksheet.insertRow(++currentRow, objArr);

                objArr = [
                    "NEW",
                    report.new.count && report.new.count != 0? report.new.count : "",
                    "",
                    report.new.win && report.new.win != 0? report.new.win : "",
                    ((report.new.win / report.new.count) * 100)? (report.new.win / report.new.count * 100).toFixed(2) : "",
                    report.new.loss && report.new.loss != 0? report.new.loss : "",
                    ((report.new.loss / report.new.count) * 100)? (report.new.loss / report.new.count * 100).toFixed(2) : "",
                    report.new.pending && report.new.pending != 0? report.new.pending : "",
                    ((report.new.pending / report.new.count) * 100)? (report.new.pending / report.new.count * 100).toFixed(2) : "",
                    report.new.disable && report.new.disable != 0? report.new.disable : "",
                    ((report.new.disable / report.new.count) * 100)? (report.new.disable / report.new.count * 100).toFixed(2) : "",
                ];

                worksheet.insertRow(++currentRow, objArr);
            }
        });

        worksheet.insertRow(++currentRow, ["Grand Total", countAll + "", percentAll, countWin+ "", percentWin, countLoss+ "",
                                            percentLoss, countPending+ "", percentPending, countDisable+ "", percentDisable]);
        const row = worksheet.getRow(currentRow);
        row.eachCell((cell, colNumber) => { if(colNumber <= 11) row.getCell(colNumber).fill = rowFill });

        this.columnWidthOptimize(worksheet);
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    async getInquiryReportActual(queryParam: IquiryReportQueryParam, user: UserAccount) {
        queryParam.user_id = await this.salesSelfFilter(user);
        let inqReportActual: any[] = await this.inquiryRepository.getInquiryReportActual(queryParam);
        const ports: PortTable[] = await this.tableService.getPort();
        const customers: CustomerProfile[] = await this.profileService.getCustomer(new CustomerProfileQueryParam(), user);
        const users: UserAccount[] = await this.userRepository.getAllUser(new UserAccountQueryParam());

        inqReportActual.forEach((report: any) => {
            let fc_ros = Number(report.fc_gp) / Number(report.fc_revernue) * 100;
            report.fc_ros = fc_ros ? fc_ros.toFixed(2) : "";

            let inq_ros = Number(report.inq_gp) / Number(report.inq_revenue) * 100;
            report.inq_ros = inq_ros ? inq_ros.toFixed(2) : "";

            const diff_revenue = Math.abs(report.inq_revenue - report.fc_revernue);
            const diff_gp = Math.abs(report.inq_gp - report.fc_gp);
            report.diff_revenue = diff_revenue ? diff_revenue < 0 ? '('+ diff_revenue +')': diff_revenue : null;
            report.diff_gp = diff_gp ? diff_gp < 0 ? '('+ diff_revenue +')': diff_gp : null;

            let inq_teu = (Number(report.inq_container_20 ? report.inq_container_20 : 0))
                    + (Number((report.inq_container_40 ? report.inq_container_40 : 0)) * 2)
                    + (Number((report.inq_container_40hc ? report.inq_container_40hc : 0)) * 2);
            report.inq_teu = inq_teu ? inq_teu : null;

            let fc_teu = (Number(report.fc_container_20 ? report.fc_container_20 : 0))
                    + (Number((report.fc_container_40 ? report.fc_container_40 : 0)) * 2)
                    + (Number((report.fc_container_40hc ? report.fc_container_40hc : 0)) * 2);
            report.fc_teu = fc_teu ? fc_teu : null;

            report.pol_port_name = null;
            report.pod_port_name = null;
            ports.forEach((port) => {
                if(report.fc_pol_id === port.port_id) {
                    report.pol_port_name = port.port_name;
                }else if(report.inq_pol_id === port.port_id) {
                    report.pol_port_name = port.port_name;
                }

                if(report.fc_pod_id === port.port_id) {
                    report.pod_port_name = port.port_name;
                }else if(report.inq_pod_id === port.port_id) {
                    report.pod_port_name = port.port_name;
                }
            });

            report.cus_name = null;
            customers.forEach((customer) => {
                if(report.fc_cus_id === customer.cus_id) {
                    report.cus_name = customer.cus_name;
                }else if(report.inq_cus_id === customer.cus_id) {
                    report.cus_name = customer.cus_name;
                }
            });

            report.user_fullname = null;
            report.user_team = null;
            users.forEach((user) => {
                if(report.fc_user_id === user.user_id) {
                    report.user_fullname = user.user_fullname;
                    report.user_team = user.user_team;
                    report.user_id = user.user_id;
                }else if(report.inq_user_id === user.user_id) {
                    report.user_fullname = user.user_fullname;
                    report.user_team = user.user_team;
                    report.user_id = user.user_id;
                }
            });

            if(!report.fc_mode){
                report.fc_mode = report.inq_mode;
            }

            if(!report.fc_type) {
                report.fc_type = report.inq_type;
            }

        });

        if(queryParam.user_team) {
            inqReportActual = inqReportActual.filter((report: any) => {
                return report.user_team === queryParam.user_team;
            });
        }

        if(queryParam.user_fliter_id) {
            inqReportActual = inqReportActual.filter((report: any) => {
                return report.user_id === queryParam.user_fliter_id;
            });
        }

        if(queryParam.inq_date_from) {
            inqReportActual = inqReportActual.filter((report: any) => {
                const fc_timestamp_unix = moment(report.fc_timestamp? report.fc_timestamp : report.inq_date).utcOffset(7).unix();
                const date_from_unix = moment(queryParam.inq_date_from).utcOffset(7).unix();
                return fc_timestamp_unix >= date_from_unix;
            });
        }

        if(queryParam.inq_date_to) {
            inqReportActual = inqReportActual.filter((report: any) => {
                const fc_timestamp_unix = moment(report.fc_timestamp? report.fc_timestamp : report.inq_date).utcOffset(7).unix();
                const date_to_unix = moment(queryParam.inq_date_to).add(1, "day").utcOffset(7).unix();
                return fc_timestamp_unix <= date_to_unix;
            });
        }

        if(queryParam.cargo_readiness_from) {
            inqReportActual = inqReportActual.filter((report: any) => {
                const fc_cargo_readiness_unix = moment(report.fc_cargo_readiness? report.fc_cargo_readiness : report.inq_cargo_readiness).utcOffset(7).unix();
                const date_from_unix = moment(queryParam.cargo_readiness_from).utcOffset(7).unix();
                return fc_cargo_readiness_unix >= date_from_unix;
            });
        }

        if(queryParam.cargo_readiness_to) {
            inqReportActual = inqReportActual.filter((report: any) => {
                const fc_cargo_readiness_unix = moment(report.fc_cargo_readiness? report.fc_cargo_readiness : report.inq_cargo_readiness).utcOffset(7).unix();
                const date_from_unix = moment(queryParam.cargo_readiness_to).utcOffset(7).unix();
                return fc_cargo_readiness_unix <= date_from_unix;
            });
        }

        return inqReportActual;
    }

    async exportInquiryReportActual(queryParam: IquiryReportQueryParam, user: UserAccount) {
        queryParam.user_id = await this.salesSelfFilter(user);
        const reportCustomer: any[] = await this.getInquiryReportActual(queryParam, user);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sale Forecast vs Actual Report');

        worksheet.insertRow(1, ['Forecast', '', '', '', '', '', '', '', '', '', '', '',
                                '', '', '', 'Actual/Inquiry', '', '', '', '', '', '',
                                '', '', '', '', 'Diff']);
        worksheet.insertRow(2, ['Sale', 'Sale Team', 'Customer', 'Mode', 'POL', 'POD', 'Type',
                                '20\'', '40\'', '40\'HC', 'CBM', 'TEU','Revenue', 'GP', 'ROS(%)',
                                'Week No.', 'Inquiry No.', '20\'', '40\'', '40\'HC', 'CBM', 'TEU',
                                'Revenue', 'GP', 'ROS(%)', 'Week No.', 'Revenue', 'GP']);

        let forecast_sum_revenue = 0;
        let forecast_sum_gp = 0;

        let actual_sum_revenue = 0;
        let actual_sum_gp = 0;

        reportCustomer.forEach((report, index) => {
            const diff_revenue = report.inq_revenue - report.fc_revernue;
            const diff_gp = report.inq_gp - report.fc_gp;

            forecast_sum_revenue += Number(report.fc_revernue);
            forecast_sum_gp += Number(report.fc_gp);

            actual_sum_revenue += Number(report.inq_revenue);
            actual_sum_gp += Number(report.inq_gp);

            const row: any[] = [
                report.user_fullname,
                report.user_team,
                report.cus_name,
                report.fc_mode,
                report.pol_port_name,
                report.pod_port_name,
                report.fc_type,
                report.fc_container_20 == "0.00" ? null : report.fc_container_20,
                report.fc_container_40 == "0.00" ? null : report.fc_container_40,
                report.fc_container_40hc == "0.00" ? null : report.fc_container_40hc,
                report.fc_container_cbm == "0.000" ? null : report.fc_container_cbm,
                report.fc_teu,
                report.fc_revernue == "0.00" ? null : report.fc_revernue,
                report.fc_gp == "0.00" ? null : report.fc_gp,
                report.fc_ros,
                report.fc_week_no,
                report.inq_no,
                report.inq_container_20 == "0.00" ? null : report.inq_container_20,
                report.inq_container_40 == "0.00" ? null : report.inq_container_40,
                report.inq_container_40hc == "0.00" ? null : report.inq_container_40hc,
                report.inq_container_cbm == "0.000" ? null : report.inq_container_cbm,
                report.inq_teu,
                report.inq_revenue == "0.00" ? null : report.inq_revenue,
                report.inq_gp == "0.00" ? null : report.inq_gp,
                report.inq_ros,
                report.inq_res_actual_week_no,
                report.inq_tx_time,
                diff_revenue ? diff_revenue.toFixed(2) : null,
                diff_gp ? diff_gp.toFixed(2) : null,
            ]
            worksheet.insertRow(index + 3, row);
        });

        let forecast_sum_ros = ((forecast_sum_gp / forecast_sum_revenue) * 100)? (forecast_sum_gp / forecast_sum_revenue * 100).toFixed(2) : "";
        let actual_sum_ros = ((actual_sum_gp / actual_sum_revenue) * 100)? (actual_sum_gp / actual_sum_revenue * 100).toFixed(2) : "";

        let diff_sum_revenue = actual_sum_revenue - forecast_sum_revenue;
        let diff_sum_gp = actual_sum_gp - forecast_sum_gp;

        worksheet.insertRow(3, ["Summary", "", "", "", "", "", "", "", "", "", "", "",
                forecast_sum_revenue.toFixed(2), forecast_sum_gp.toFixed(2), forecast_sum_ros,
                "", "", "", "", "", "", "",
                actual_sum_revenue.toFixed(2), actual_sum_gp.toFixed(2), actual_sum_ros, "",
                diff_sum_revenue ?  diff_sum_revenue.toFixed(2) : null,
                diff_sum_gp ? diff_sum_gp.toFixed(2) : null, ]);

        worksheet.mergeCells('A1:O1');
        worksheet.mergeCells('P1:Z1');
        worksheet.mergeCells('AA1:AB1');

        this.columnWidthOptimize(worksheet);
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(2).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    async getInquiryReportKey(queryParam: IquiryReportQueryParam, user: UserAccount) {
        queryParam.user_id = await this.salesSelfFilter(user);
        const inqReportKey = await this.inquiryRepository.getInquiryReportKey(queryParam);
        return inqReportKey;
    }

    async exportInquiryReportKey(queryParam: IquiryReportQueryParam, user: UserAccount) {
        const reportKey: any[] = await this.getInquiryReportKey(queryParam, user);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Key Customer Revenue & GP');

        worksheet.insertRow(1, ['Customer Key A/C', 'Summary', '', 'Jan', '', 'Feb', '', 'Mar', '',
                                'Apr', '', 'May', '', 'June', '', 'Jul', '', 'Aug', '',
                                'Sep', '', 'Oct', '', 'Nov', '', 'Dec']);
        worksheet.insertRow(2, ['', 'Revenue', 'GP', 'Revenue', 'GP','Revenue', 'GP',
                                'Revenue', 'GP','Revenue', 'GP','Revenue', 'GP','Revenue', 'GP',
                                'Revenue', 'GP','Revenue', 'GP','Revenue', 'GP','Revenue', 'GP',
                                'Revenue', 'GP','Revenue', 'GP']);

        let inq_revenue_sum = 0
        let inq_gp_sum = 0;
        let month_1_revenue = 0;
        let month_1_gp = 0;
        let month_2_revenue = 0;
        let month_2_gp = 0;
        let month_3_revenue = 0;
        let month_3_gp = 0;
        let month_4_revenue = 0;
        let month_4_gp = 0;
        let month_5_revenue = 0;
        let month_5_gp = 0;
        let month_6_revenue = 0;
        let month_6_gp = 0;
        let month_7_revenue = 0;
        let month_7_gp = 0;
        let month_8_revenue = 0;
        let month_8_gp = 0;
        let month_9_revenue = 0;
        let month_9_gp = 0;
        let month_10_revenue = 0;
        let month_10_gp = 0;
        let month_11_revenue = 0;
        let month_11_gp = 0;
        let month_12_revenue = 0;
        let month_12_gp = 0;

        reportKey.forEach((report: any, index: number) => {
            let report_val: string[] = Object.values<string>(report);
            report_val = report_val.map(val => val == "0.00" ? null : val);
            worksheet.insertRow(3 + index, report_val);

            inq_revenue_sum += Number(report.inq_revenue_sum);
            inq_gp_sum += Number(report.inq_gp_sum);
            month_1_revenue += Number(report.month_1_revenue);
            month_1_gp += Number(report.month_1_gp);
            month_2_revenue += Number(report.month_2_revenue);
            month_2_gp += Number(report.month_2_gp);
            month_3_revenue += Number(report.month_3_revenue);
            month_3_gp += Number(report.month_3_gp);
            month_4_revenue += Number(report.month_4_revenue);
            month_4_gp += Number(report.month_4_gp);
            month_5_revenue += Number(report.month_5_revenue);
            month_5_gp += Number(report.month_5_gp);
            month_6_revenue += Number(report.month_6_revenue);
            month_6_gp += Number(report.month_6_gp);
            month_7_revenue += Number(report.month_7_revenue);
            month_7_gp += Number(report.month_7_gp);
            month_8_revenue += Number(report.month_8_revenue);
            month_8_gp += Number(report.month_8_gp);
            month_9_revenue += Number(report.month_9_revenue);
            month_9_gp += Number(report.month_9_gp);
            month_10_revenue += Number(report.month_10_revenue);
            month_10_gp += Number(report.month_10_gp);
            month_11_revenue += Number(report.month_11_revenue);
            month_11_gp += Number(report.month_11_gp);
            month_12_revenue += Number(report.month_12_revenue);
            month_12_gp += Number(report.month_12_gp);
        });

        worksheet.insertRow(3, [
            "Summary",
            inq_revenue_sum ? inq_revenue_sum.toFixed(2) : null,
            inq_gp_sum ? inq_gp_sum.toFixed(2) : null,
            month_1_revenue ? month_1_revenue.toFixed(2) : null,
            month_1_gp ? month_1_gp.toFixed(2) : null,
            month_2_revenue ? month_2_revenue.toFixed(2) : null,
            month_2_gp ? month_2_gp.toFixed(2) : null,
            month_3_revenue ? month_3_revenue.toFixed(2) : null,
            month_3_gp ? month_3_gp.toFixed(2) : null,
            month_4_revenue ? month_4_revenue.toFixed(2) : null,
            month_4_gp ? month_4_gp.toFixed(2) : null,
            month_5_revenue ? month_5_revenue.toFixed(2) : null,
            month_5_gp ? month_5_gp.toFixed(2) : null,
            month_6_revenue ? month_6_revenue.toFixed(2) : null,
            month_6_gp ? month_6_gp.toFixed(2) : null,
            month_7_revenue ? month_7_revenue.toFixed(2) : null,
            month_7_gp ? month_7_gp.toFixed(2) : null,
            month_8_revenue ? month_8_revenue.toFixed(2) : null,
            month_8_gp ? month_8_gp.toFixed(2) : null,
            month_9_revenue ? month_9_revenue.toFixed(2) : null,
            month_9_gp ? month_9_gp.toFixed(2) : null,
            month_10_revenue ? month_10_revenue.toFixed(2) : null,
            month_10_gp ? month_10_gp.toFixed(2) : null,
            month_11_revenue ? month_11_revenue.toFixed(2) : null,
            month_11_gp ? month_11_gp.toFixed(2) : null,
            month_12_revenue ? month_12_revenue.toFixed(2) : null,
            month_12_gp ? month_12_gp.toFixed(2) : null,
        ]);

        worksheet.mergeCells('A1:A2');
        worksheet.mergeCells('B1:C1');
        worksheet.mergeCells('D1:E1');
        worksheet.mergeCells('F1:G1');
        worksheet.mergeCells('H1:I1');
        worksheet.mergeCells('J1:K1');
        worksheet.mergeCells('L1:M1');
        worksheet.mergeCells('N1:O1');
        worksheet.mergeCells('P1:Q1');
        worksheet.mergeCells('R1:S1');
        worksheet.mergeCells('T1:U1');
        worksheet.mergeCells('V1:W1');
        worksheet.mergeCells('X1:Y1');
        worksheet.mergeCells('Z1:AA1');

        this.columnWidthOptimize(worksheet);
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(2).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    async getInquiryReportCustomer(queryParam: IquiryReportQueryParam, user: UserAccount) {
        queryParam.user_id = await this.salesSelfFilter(user);
        const inqReportCustomer: any[] = await this.inquiryRepository.getInquiryReportCustomer(queryParam);
        inqReportCustomer.forEach((report) => {
            let ros = Number((report.inq_gp / report.inq_revenue) * 100);
            let teu = (Number(report.inq_container_20 ? report.inq_container_20 : 0))
                    + (Number((report.inq_container_40 ? report.inq_container_40 : 0)) * 2)
                    + (Number((report.inq_container_40hc ? report.inq_container_40hc : 0)) * 2);
            report.inq_ros = ros ? ros.toFixed(2) : null;
            report.inq_teu = teu ? teu : null;
        });
        return inqReportCustomer;
    }

    async exportInquiryReportCustomer(queryParam: IquiryReportQueryParam, user: UserAccount) {
        queryParam.filter_customer = await this.salesOwnerCust(user);
        const reportCustomer = await this.getInquiryReportCustomer(queryParam, user);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Customer Performance');

        worksheet.insertRow(1, ['', '', '', '', '', '', '', '', '', '', '', '', 'Volume']);
        worksheet.insertRow(2, ['Customer Type', 'Customer', 'Inquiry No.', 'Sale',
                                'Team', 'Mode','Term', 'POL', 'POD', 'Carrier', 'Commodity',
                                'Type', '20\'', '40\'', '40HC\'', 'CBM', 'TEU', 'Revenue',
                                'GP', 'ROS(%)', 'Result']);

        let inq_revenue_sum = 0;
        let inq_gp_sum = 0;

        reportCustomer.forEach((report, index) => {
            const row: any[] = [
                report.cus_type,
                report.cus_name,
                report.inq_no,
                report.user_fullname,
                report.user_team,
                report.inq_mode,
                report.inq_incoterms,
                report.pol_port_name,
                report.pod_port_name,
                report.cr_name,
                report.inq_commodity,
                report.inq_type,
                report.inq_container_20,
                report.inq_container_40,
                report.inq_container_40hc,
                report.inq_container_cbm,
                report.inq_teu,
                report.inq_revenue,
                report.inq_gp,
                report.inq_ros,
                report.inq_res_quote_status
            ]

            inq_revenue_sum += Number(report.inq_revenue);
            inq_gp_sum += Number(report.inq_gp);

            worksheet.insertRow(index + 3, row);
        });

        let inq_sum_ros = ((inq_gp_sum / inq_revenue_sum) * 100) ? (inq_gp_sum / inq_revenue_sum * 100).toFixed(2) : "";

        worksheet.insertRow(3, [
            "Summary",
            "","","","","","","","","","","","","","","","",
            inq_revenue_sum ? inq_revenue_sum.toFixed(2) : null,
            inq_gp_sum ? inq_gp_sum.toFixed(2) : null,
            inq_sum_ros
        ]);

        worksheet.mergeCells('M1:R1');

        this.columnWidthOptimize(worksheet);
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(2).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    async getInquiryReportTopCustomer(queryParam: IquiryReportQueryParam, user: UserAccount) {
        queryParam.user_id = await this.salesSelfFilter(user);
        const inqReportTopCustomer: any[] = await this.inquiryRepository.getInquiryReportTopCustomer(queryParam);
        inqReportTopCustomer.forEach((report: any) => {
            let inq_ros = Number((report.inq_gp_sum / report.inq_revenue_sum) * 100);
            report.inq_ros = (inq_ros? inq_ros.toFixed(2) : null);
        });
        return inqReportTopCustomer;
    }

    async exportInquiryReportTopCustomer(queryParam: IquiryReportQueryParam, user: UserAccount) {
        queryParam.user_id = await this.salesSelfFilter(user);
        const reportTopCustomer = await this.getInquiryReportTopCustomer(queryParam, user);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Top 10 Custoemr Inquiry Report');

        worksheet.insertRow(1, ['Customer', 'Sales', 'No. of Inquiry', 'No. of Container',
                                'Revenue', 'GP','ROS(%)']);

        let inq_count = 0;
        let container_count = 0;
        let inq_revenue_sum = 0;
        let inq_gp_sum = 0;

        reportTopCustomer.forEach((report, index) => {
            worksheet.insertRow(index + 2, [
                report.cus_name,
                report.user_fullname,
                Number(report.inq_count),
                Number(report.container_count),
                Number(report.inq_revenue_sum).toFixed(2),
                Number(report.inq_gp_sum).toFixed(2),
                (report.inq_gp_sum / report.inq_revenue_sum * 100) ? (report.inq_gp_sum / report.inq_revenue_sum * 100).toFixed(2) : ""
            ]);

            inq_count += Number(report.inq_count);
            container_count += Number(report.container_count);
            inq_revenue_sum += Number(report.inq_revenue_sum);
            inq_gp_sum += Number(report.inq_gp_sum);
        });

        let inq_sum_ros = ((inq_gp_sum / inq_revenue_sum) * 100) ? (inq_gp_sum / inq_revenue_sum * 100).toFixed(2) : "";

        worksheet.insertRow(2, [
            "Summary",
            "",
            inq_count,
            container_count,
            inq_revenue_sum.toFixed(2),
            inq_gp_sum.toFixed(2),
            inq_sum_ros
        ]);

        this.columnWidthOptimize(worksheet);
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    async getInquiryReportBooking(queryParam: IquiryReportQueryParam, user: UserAccount) {
        queryParam.user_id = await this.salesSelfFilter(user);
        const inqReportBooking: any[] = await this.inquiryRepository.getInquiryReportBooking(queryParam);
        return inqReportBooking;
    }

    async exportInquiryReportBooking(queryParam: IquiryReportQueryParam, user: UserAccount) {
        queryParam.user_id = await this.salesSelfFilter(user);
        const reportBooking = await this.getInquiryReportBooking(queryParam, user);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Booking Report');

        worksheet.insertRow(1, ['Comment', 'GW Per CNTR (Kg)', 'Status', 'Status Date', 'Status Time', 'Inquiry No.',
                                'Cargo Ready Date', 'Revenue', 'GP', 'Customer','Sales', 'Mode',
                                'POL', 'POD', 'Commodity', 'Type', '20\'', '40\'', '40\'', 'CBM']);

        let inq_count = 0;
        let inq_sum_revenue = 0;
        let inq_sum_gp = 0;
        let inq_container_20 = 0;
        let inq_container_40 = 0;
        let inq_container_40hc = 0;

        reportBooking.forEach((report, index) => {
            worksheet.insertRow(index + 2, [
                report.inq_res_comment,
                report.inq_qw_per_cntr,
                report.inq_status,
                report.inq_tx_time ? moment(report.inq_tx_time).format("DD-MM-YY") : "",
                report.inq_tx_time ? moment(report.inq_tx_time).format("HH:mm:ss") : "",
                report.inq_no,
                report.inq_cargo_readiness ? moment(report.inq_cargo_readiness).format("DD-MM-YY") : "",
                report.inq_revenue,
                report.inq_gp,
                report.cus_name,
                report.user_fullname,
                report.inq_mode,
                report.pol_port_name,
                report.pod_port_name,
                report.inq_commodity,
                report.inq_type,
                report.inq_container_20 == "0.00" ? null : report.inq_container_20,
                report.inq_container_40 == "0.00" ? null : report.inq_container_40,
                report.inq_container_40hc == "0.00" ? null : report.inq_container_40hc,
                report.inq_container_cbm == "0.000" ? null : report.inq_container_cbm
            ]);

            inq_count++;
            inq_sum_revenue += Number(report.inq_revenue);
            inq_sum_gp += Number(report.inq_gp);
            inq_container_20 += Number(report.inq_container_20);
            inq_container_40 += Number(report.inq_container_40);
            inq_container_40hc += Number(report.inq_container_40hc);
        });

        worksheet.insertRow(2, [
            "Summary",
            "","","","",
            inq_count,
            "",
            inq_sum_revenue.toFixed(2),
            inq_sum_gp.toFixed(2),
            "","","","","","","",
            inq_container_20,
            inq_container_40,
            inq_container_40hc
        ]);

        this.columnWidthOptimize(worksheet);
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    async getRateInquiry(queryParam: InquiryQueryParam) {
        const inqRate = await this.inquiryRepository.getRateInquiry(queryParam);
        return inqRate;
    }

    async addRateInquiry(inq_uuid: string, inqRate: InquiryRate) {
        const inq_rate = new InquiryRate();
        inq_rate.inq_rate_uuid = uuidv4();
        inq_rate.inq_uuid = inq_uuid;
        inq_rate.rate_id = inqRate.rate_id;
        inq_rate.rate_recommend = 'R';

        const addInqRate = await this.inquiryRepository.addRateInquiry([inq_rate]);
        return addInqRate;
    }

    async deleteRateInquiry(inq_uuid: string, inq_rate: InquiryRate) {
        if(!inq_rate.rate_id) {
            throw new NotAcceptableError("rate_id is null");
        }

        const inq = await this.inquiryRepository.deleteRateInquiry(inq_uuid, inq_rate);
        return inq;
    }

    async addInquiry(inq: Inquiry) {
        try{
            inq.inq_uuid = uuidv4();
            inq.inq_timestamp = moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss");

            const queryParam = new InquiryQueryParam();
            const month = Number(moment().utcOffset(7).format('MM'));
            const year = Number(moment().utcOffset(7).format('YY'));
            queryParam.timestamp_month = Number(moment().utcOffset(7).format('MM'));
            queryParam.timestamp_year = Number(moment().utcOffset(7).format('YYYY'));

            const inq_set = await this.inquiryRepository.getInquiry(queryParam);
            const count = inq_set.length;
            const iqNumber = numeral(count + 1).format('0000');
            const iqMonth = numeral(month).format('00');
            inq.inq_no = `IQ${year}${iqMonth}${iqNumber}`;
            const inqAdd = await this.inquiryRepository.addInquiry(inq);

            const datetime = moment().format("YYYY-MM-DD HH:mm:ss");
            const transaction: Transaction = new Transaction();
                transaction.tx_uuid = uuidv4();
                transaction.tx_target_status = inq.inq_status;
                transaction.tx_target_type = "INQ";
                transaction.tx_target_uuid = inq.inq_uuid;
                transaction.tx_time = datetime
            await this.transactionService.addTransasction(transaction);

            const inq_tx_time_update = new Inquiry();
            inq_tx_time_update.inq_tx_time = datetime;
            await this.inquiryRepository.updateInquiry(inq.inq_uuid, inq_tx_time_update);

            return inqAdd;
        } catch(error) {
            throw error;
        }
    }

    async calInqRate(inqs: Inquiry[]) {
        for(let i = 0; i < inqs.length; i++) {
            const inq = inqs[i];
            let recommendedRate: RateTable[] = [];
            const rateQueryParam = new RateTableQueryParam();
            if (!inq.inq_rate_id) {
                rateQueryParam.rate_recommend = "R";
                rateQueryParam.expired = false;

                if (inq.inq_type) {
                    rateQueryParam.rate_type = inq.inq_type;
                }

                if (inq.inq_cus_id) {
                    rateQueryParam.rate_cus_id = inq.inq_cus_id;
                }

                if (inq.inq_mode) {
                    switch (inq.inq_mode) {
                        case "Sea Export": {
                            rateQueryParam.rate_pod_id = inq.inq_pod_id;
                            break;
                        }

                        case "Sea Import": {
                            rateQueryParam.rate_pol_id = inq.inq_pol_id;
                            break;
                        }

                        case "Triangle": {
                            rateQueryParam.rate_pod_id = inq.inq_pod_id;
                            rateQueryParam.rate_pol_id = inq.inq_pol_id;
                            break;
                        }
                    }
                }

                if (inq.inq_cargo_readiness) {
                    rateQueryParam.inq_cargo_readiness = inq.inq_cargo_readiness;
                }

            } else {
                rateQueryParam.rate_id = inq.inq_rate_id;
            }

            recommendedRate = await this.rateTableRepository.getRateTable(rateQueryParam);

            if (recommendedRate.length > 0) {
                const inqRates: InquiryRate[] = [];
                recommendedRate.forEach((rate) => {
                    const inqRate = new InquiryRate();
                    inqRate.inq_rate_uuid = uuidv4();
                    inqRate.inq_uuid = inq.inq_uuid;
                    inqRate.rate_id = rate.rate_id;
                    inqRate.rate_recommend = rate.rate_recommend;
                    inqRates.push(inqRate);
                });
                await this.inquiryRepository.addRateInquiry(inqRates);
            }
        };
    }

    async updateInquiry(inq_uuid: string, inq: Inquiry) {
        delete inq.inq_uuid;
        delete inq.inq_no;
        delete inq.inq_status;
        delete inq.inq_timestamp;
        delete inq.inq_tx_time;
        const inqUpdate = await this.inquiryRepository.updateInquiry(inq_uuid, inq);
        return inqUpdate;
    }

    async updateStatusInquiry(inq_uuid: string, inq_status: string) {
        try {
            const inqUpdate = await this.inquiryRepository.updateStatusInquiry(inq_uuid, inq_status);
            const transaction: Transaction = new Transaction();
            transaction.tx_uuid = uuidv4();
            transaction.tx_target_status = inq_status;
            transaction.tx_target_type = "INQ";
            transaction.tx_target_uuid = inq_uuid;
            transaction.tx_time = moment().format("YYYY-MM-DD HH:mm:ss");
            await this.transactionService.addTransasction(transaction);

            const datetime = moment().format("YYYY-MM-DD HH:mm:ss");
            const inq_tx_time_update = new Inquiry();
            inq_tx_time_update.inq_tx_time = datetime;

            switch(inq_status) {
                case "waiting sales": {
                    inq_tx_time_update.inq_waiting_sales = 0;
                    break;
                }
                case "waiting marketing": {
                    inq_tx_time_update.inq_waiting_mktg = 0;
                    break;
                }
                case "waiting customer": {
                    inq_tx_time_update.inq_waiting_cus = 0;
                    break;
                }
                case "waiting quotation": {
                    inq_tx_time_update.inq_waiting_quotation = 0;
                    break;
                }
            }

            await this.inquiryRepository.updateInquiry(inq_uuid, inq_tx_time_update);

            return inqUpdate;
        } catch(error) {
            throw error;
        }
    }

    async updateQtnStatusInquiry(inq_uuid: string, inq_qtn: string) {
        const inqUpdate = await this.inquiryRepository.updateQtnStatusInquiry(inq_uuid, inq_qtn);
        return inqUpdate;
    }

    columnWidthOptimize = (worksheet: ExcelJS.Worksheet) => {
        worksheet.columns.forEach((column) => {
            let maxLength = 0;
                column["eachCell"]({ includeEmpty: true }, (cell) => {
                    let columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength ) {
                        maxLength = columnLength;
                    }
                });

                column.width = maxLength < 10 ? 10 : maxLength > 50 ? 50: maxLength;
        });
    }

    async salesOwnerCust(user: UserAccount): Promise<string[]> {
        if(user) {
            const cust_id_set = new Set<string>();
            cust_id_set.add("00000000-0000-0000-0000-000000000000");
            switch(user.user_role) {
                case "salesManager": {
                    const cust_ids = await this.customerOwnerService.getUserOwnerWorker(user.user_id);
                    cust_ids.map((id) => { cust_id_set.add(id) });
                }
                case "sales": {
                    const cust_id: any[] = await this.userRepository.getUserCustOwner(user.user_id);
                    cust_id.map((cust) => {
                        if(cust.cus_id) {
                            cust_id_set.add(cust.cus_id)
                        }
                    });
                    return Array.from(cust_id_set);
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
            case "systemAdmin":
            case "dataAdmin":
            case "management":
            case "marketing":
            case "marketingManager": {
                return null;
            }
            default: throw new ForbiddenError("Role can't access");
        }
    }
}
