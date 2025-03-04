import { IsNumber, IsOptional } from "class-validator";

export class Calendar {
    @IsOptional()
    cd_id: string;
    @IsNumber()
    cd_date: number;
    @IsNumber()
    cd_month: number;
    cd_holiday: string;
}
