import { UnitOfWork } from "./UnitOfWork";

export interface IUnitOfWorkFactory {
    create(): UnitOfWork
}
