import { IsEmail, IsOptional } from "class-validator";

export class UserAccount {
    @IsOptional()
    user_id: string;

    user_username: string;

    @IsOptional()
    user_password: string;

    @IsOptional()
    user_password_hash: string;

    user_fullname: string;

    @IsOptional()
    user_mobile: string;

    @IsOptional()
    user_phone: string;

    @IsEmail()
    user_mail: string;

    @IsOptional()
    user_social_id: string;

    @IsOptional()
    user_level: string;

    @IsOptional()
    user_team: string;

    @IsOptional()
    user_image: string;

    @IsOptional()
    user_disable: boolean;

    user_role: string;
}
