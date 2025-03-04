import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Service } from "typedi";
import DotEnv from "dotenv";
import { AxiosFactoryConnection, IAxiosConnection } from "./IAxiosConnection";
DotEnv.config();

@Service()
@Service(AxiosFactoryConnection)
export class AxiosFactory implements IAxiosConnection{

    public create(target: string): AxiosInstance{
        switch(target) {
            case "mail": { 
                const config: AxiosRequestConfig = {
                    baseURL: process.env.MAIL_SERVER_IP
                }
                return axios.create(config);
            }
        }
    }

    public createCustom(api_url: string, api_key: string): AxiosInstance {
        const config: AxiosRequestConfig = {
            baseURL: api_url,
            headers: {
                "Authorization": api_key
            }
        }
        return axios.create(config);
    }
}
