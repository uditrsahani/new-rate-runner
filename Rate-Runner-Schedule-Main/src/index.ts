import "reflect-metadata";
import Dotenv from "dotenv";
import Container from "typedi";
import schedule from "node-schedule";
import { ErrorResponderMiddleware } from "./utils/middlewares/ErrorResponderMiddleware";
import { Application } from "./core/Application";
import { LoggerMiddleware } from "./utils/middlewares/LoggerMiddleware";
import moment from "moment";
import { TimeSchedule } from "./modules/TimeSchedule";

Dotenv.config();
export class Server extends Application {
    constructor() {
        super({
            defaultErrorHandler: false
        });

        this.useContainer(Container)
            .useMiddleware(ErrorResponderMiddleware)
            .useMiddleware(LoggerMiddleware)
    }

    async onApplicationStarted() {
        const leadtime = new TimeSchedule();
        schedule.scheduleJob('0 1 * * *', async () => {
            try {
                const res = await leadtime.updateLeadtime();
                console.log(moment(), res);
            }catch(error){
                console.log(moment(), error.message);
            }
        });
    }
    
    public async onProcessInterrupt() {
        await new Promise<void>((resolve, reject) => this.server.close((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })).then(() => {
            console.log("Terminated with code 0");
            process.exit(0)
        }).catch(() =>  {
            console.log("Terminated with code 1");
            process.exit(1)
        });
    }
}

const app = new Server();
app.start(parseInt(process.env.PORT) || 80);
