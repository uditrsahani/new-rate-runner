import { AxiosInstance } from "axios";
import { Token } from "typedi";

export interface IAxiosConnection {
    create(target: string): AxiosInstance
    createCustom(api_url: string, api_key: string): AxiosInstance
}

export const AxiosFactoryConnection = new Token<IAxiosConnection>();
