import { Knex } from "knex";

export interface IDatabaseRepository {
    executeQuery<TResult = any>(
        query: (queryBuilder: Knex.QueryBuilder) => Promise<Knex.QueryBuilder>
    ): Promise<TResult>
    first<TEntity>(predicate: Knex.QueryCallback<TEntity>) : Promise<any>
    find<TEntity>(predicate: Knex.QueryCallback<TEntity>): Promise<any>
    insert(data: any): Promise<any>
    delete(predicate: Knex.QueryCallback): Promise<any>
}
