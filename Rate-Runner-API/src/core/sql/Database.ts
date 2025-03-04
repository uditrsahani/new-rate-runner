import { knex, Knex } from ".";
import { ApplicationError } from "app/utils/errors/ApplicationError";
import Container, { Service } from "typedi";
import { Pool } from "mysql2";

const DEFAULT_INSTANCE_NAME = "default";

@Service()
export class Database {
    protected static _instance: Database;
    protected _knex: Knex;
    protected pool: Pool;

    constructor(connectionSetting?: Knex.Config) {
        this._knex = connectionSetting
            ? knex(connectionSetting)
            : knex({
                client: "mysql2",
                connection: {
                    user: process.env.MYSQL_USER,
                    host: process.env.MYSQL_HOST,
                    database: process.env.MYSQL_DATABASE,
                    password: process.env.MYSQL_PASSWORD,
                    port: parseInt(process.env.MYSQL_PORT),
                }
            });
    }

    public static get instance() {
        try {
            Database.getConnection(DEFAULT_INSTANCE_NAME);
        } catch {
            Database.createConnection(DEFAULT_INSTANCE_NAME);
        }
        return Database.getConnection(DEFAULT_INSTANCE_NAME);
    }

    public get knex() {
        return this._knex;
    }

    public static getConnection(connectionName: string) {
        return Container.get<Database>(connectionName);
    }

    public static createConnection(connectionName: string, connectionSetting?: Knex.Config) {
        Container.set(connectionName, new Database(connectionSetting));
    }
}

export class DatabaseError extends ApplicationError {
    constructor(message: string, public inner: Error) {
        super(message);
    }
}
