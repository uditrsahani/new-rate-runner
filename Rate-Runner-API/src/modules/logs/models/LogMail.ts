import { IsOptional } from "class-validator"

export class LogMail {
    @IsOptional()
    log_uuid: string
    @IsOptional()
    user_id: string
    @IsOptional()
    agent_id: string
    @IsOptional()
    inq_uuid: string
    @IsOptional()
    timestamp: string
    @IsOptional()
    to_mail: string[]
    @IsOptional()
    to_cc: string[]
    @IsOptional()
    subject: string
    @IsOptional()
    html: string
}
