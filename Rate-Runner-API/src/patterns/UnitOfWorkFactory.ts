import { Database } from "app/core/sql";
import { Service } from "typedi";
import { IUnitOfWorkFactory } from "./IUnitOfWorkFactory";
import { UnitOfWork } from "./UnitOfWork";

@Service()
export class UnitOfWorkFactory implements IUnitOfWorkFactory{

    create(): UnitOfWork {
        return new UnitOfWork(Database.instance);
    }
    
}
