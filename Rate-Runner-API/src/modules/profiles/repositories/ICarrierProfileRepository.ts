import { Token } from "typedi";
import { CarrierProfile } from "../models/CarrierProfile";

export interface ICarrierProfileRepository {
    getCarrier(): Promise<CarrierProfile[]>
    addCarrier(carrier: CarrierProfile): Promise<any>
    updateCarrier(cr_id: string, carrier: CarrierProfile): Promise<any>
}

export const CarrierProfileRepositoryToken = new Token<ICarrierProfileRepository>();
