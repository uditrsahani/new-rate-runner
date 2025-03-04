import { IDisposable } from "app/core/Disposable";

export interface IUnitOfWork<TConnection = any, TTransaction = any> extends IDisposable {
    transaction: TTransaction;
    connection: TConnection;
    initialize(connection: TConnection): Promise<void>;
    saveChanges(): Promise<void>;
    rollback(): Promise<void>;
}