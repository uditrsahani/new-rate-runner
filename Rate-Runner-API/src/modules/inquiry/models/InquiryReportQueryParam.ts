import { InquiryQueryParam } from "./InquiryQueryParam";

export class IquiryReportQueryParam extends InquiryQueryParam{
    group: string
    user_team: string
    user_fliter_id: string
    cus_type: string
    inq_cargo_readiness_from: string
    inq_cargo_readiness_to: string
    cargo_readiness_from: string
    cargo_readiness_to: string
}
