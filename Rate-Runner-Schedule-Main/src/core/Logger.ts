import moment from "moment";
import { Service } from "typedi";
import { createLogger, format, Logger, transports } from "winston";
import 'winston-daily-rotate-file';

@Service()
export class LogManager {
    protected static _instance: LogManager;
    public readonly logger: Logger;

    public static get instance(): LogManager {
        if (!LogManager._instance) {
            LogManager._instance = new LogManager();
        }
        return LogManager._instance;
    }

    constructor() {
        const loggerConfig = {
            filename: 'logs/api-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '1d',
            maxFiles: '3d',
            json: true
        };

        const transport = new transports.DailyRotateFile(loggerConfig);

        this.logger = createLogger({
            transports: [
                new transports.Console({
                    format: format.simple(),
                }),
                transport
            ]
        });
    }
}
