import { Database, Knex } from ".";
import { IUnitOfWork } from "app/patterns/IUnitOfWork";
import { ApplicationError } from "app/utils/errors/ApplicationError";

export abstract class DatabaseUnitOfWork implements IUnitOfWork<Database, Knex.Transaction> {

    private _disposed: boolean;
    private _transaction: Knex.Transaction;
    private _connection: Database;

    get connection() {
        return this._connection;
    }

    get transaction() {
        return this._transaction;
    }

    get disposed() {
        return this._disposed;
    }

    constructor(connection: Database) {
        this._connection = connection;
    }
    
    public async initialize(): Promise<void> {
        this._transaction = await this.connection.knex.transaction();
    }

    public async saveChanges(): Promise<void> {
        if (!this.connection || !this.transaction) {
            throw new UnitOfWorkError("Invalid state.");
        }

        try {
            await this.transaction.commit();
            this._transaction = undefined;
        } catch (error) {
            this._transaction = undefined;
            console.error(error);
            throw new UnitOfWorkError("Cannot save state changes, please see logs.");
        }
    }

    public async rollback(): Promise<void> {
        if (!this.transaction) {
            return;
        }

        try {
            await this.transaction.rollback();
            this._transaction = undefined;
        } catch (error) {
            this._transaction = undefined;
            console.error(error);
            throw new UnitOfWorkError("Cannot rollback changes, please see logs.");
        }
    }

    public async dispose(): Promise<void> {
        if (this.disposed) {
            return;
        }

        if (!this.transaction) {
            return;
        }

        await this.rollback();
        this._disposed = true;
    } 

}

export class UnitOfWorkError extends ApplicationError {
    constructor(message: string) {
        super(message);
    }
}
