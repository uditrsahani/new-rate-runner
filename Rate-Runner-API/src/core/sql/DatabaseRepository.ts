import { IUnitOfWork } from "app/patterns";
import { Connection } from "mysql2";
import { Service } from "typedi";
import { Database, DatabaseError, Knex } from ".";
import { IDatabaseRepository } from "./IDatabaseRepository";

@Service()
export abstract class DatabaseRepository<TEntity = any> implements IDatabaseRepository {
    public abstract readonly tableName: string;
    protected knex: Knex;
    protected connection: Connection;

    constructor(
        protected readonly unitOfWork: IUnitOfWork<Database, Knex.Transaction>
    ) {
        this.knex = Database.instance.knex;
    }

    public async executeQuery<TResult = TEntity>(
        query: (queryBuilder: Knex.QueryBuilder) => Promise<Knex.QueryBuilder>
    ) {
        try {
            const result = await query(
                this.unitOfWork.connection
                    .knex(this.tableName)
                    .transacting(this.unitOfWork.transaction)
            );
            return result as TResult;
        } catch (error) {
            console.error(error);
            throw new DatabaseError("Query execute failed, see logs", error);
        }
    }

    public async first<TEntity = any>(predicate: Knex.QueryCallback<TEntity>) {
        return await this.executeQuery(query => query.where(predicate).first());
    }

    public async find<TEntity = any>(predicate: Knex.QueryCallback<TEntity>) {
        return await this.executeQuery(query => query.where(predicate));
    }

    public async insert(data: any): Promise<any> {
        return await this.executeQuery(query => query.insert(data));
    }

    public async delete(predicate: Knex.QueryCallback): Promise<any> {
        return await this.executeQuery(query => query.where(predicate).del());
    }
}
