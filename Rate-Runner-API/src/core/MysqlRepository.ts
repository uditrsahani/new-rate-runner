import knex, { Knex } from "knex";
import { Pool } from "mysql2";
import { MysqlDatabase } from "./MysqlDatabase";

export abstract class MysqlRepository<TEntity> {
    public abstract readonly tableName: string;

    protected knex: Knex
    protected connection: Pool

    constructor() {
        this.knex = knex({
            client: "mysql"
        });

        this.connection = MysqlDatabase.instance.connection;
    }

    public getQueryBuilder<CustomEnity = TEntity>(tableName: string = null) {
        return this.knex<CustomEnity | any>(tableName || this.tableName)
            .connection(this.connection)     
    }

    public async first(predicate: Knex.QueryCallback<TEntity>) {
        return this.getQueryBuilder()
            .where(predicate)
            .first()
    }

    public async find(predicate: Knex.QueryCallback<TEntity>) {
        return this.getQueryBuilder()
            .where(predicate)
    }

    public async insert(data: any): Promise<any> {
        return this.getQueryBuilder()
            .insert(data)
    }
}
