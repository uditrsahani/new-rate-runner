export class ForecastQueryParam {
    fc_cus_id: string
    fc_pol_id: string
    fc_pod_id: string
    user_id: string[]
    month: number
    year: number
    last: boolean
    timestamp_month: number
    timestamp_year: number
    filter_customer: string[]
    cargo_readiness_month: number
    cargo_readiness_year: number
    fc_cargo_readiness_from: string
    fc_cargo_readiness_to: string
}
