import { AxiosFactory } from "app/core/AxiosFactory";
import DotEnv from "dotenv";
DotEnv.config();

export class TimeSchedule {

    private serverIp: string;
    private apiKey: string;

    constructor() {
        this.serverIp = process.env.API_SERVER_IP;
        this.apiKey = process.env.API_KEY;
        console.log(`API_SERVER_IP: ${this.serverIp}`);
        console.log(`API_KEY: ${this.apiKey}`);
    }

    async updateLeadtime() {
        const factory = new AxiosFactory();
        const axios = factory.createCustom(this.serverIp, this.apiKey);
        const result = await axios.post<any>("/schedule");
        return result.data;
    }
}
