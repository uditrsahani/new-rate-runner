import { Token } from "typedi";
import { PortTable } from "../models/PortTable";

export interface IPortTableRepository {
    getPort(param?: PortTable): Promise<PortTable[]>
    addPort(port: PortTable): Promise<any>
    updatePort(port_id: string, port: PortTable): Promise<any>
}

export const PortTableRepositoryToken = new Token<IPortTableRepository>();
