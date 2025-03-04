import axios, { AxiosInstance } from "axios";
import { Service } from "typedi";
import DotEnv from "dotenv";
DotEnv.config();

@Service()
export class Axios {
    protected static _instance: Axios;
    public readonly connection: AxiosInstance;

    public static get instance(): Axios {
        if (!Axios._instance) {
            Axios._instance = new Axios();
        }

        return Axios._instance;
    }

    constructor() {
        this.connection = axios.create();
    }
}