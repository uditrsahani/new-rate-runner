import { createPool, Pool } from "mysql2";

export class MysqlDatabase {

    protected static _instance: MysqlDatabase;
    public readonly connection: Pool;

    public static get instance(): MysqlDatabase {
        if (!MysqlDatabase._instance) {
            MysqlDatabase._instance = new MysqlDatabase();
        }

        return MysqlDatabase._instance;
    }

    constructor() {
        this.connection = createPool({
            user: process.env.MYSQL_USER,
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_DATABASE,
            password: process.env.MYSQL_PASSWORD,
            port: parseInt(process.env.MYSQL_PORT),
            connectionLimit: 30,
            waitForConnections: true,
            queueLimit: 0
        });
    }
}
