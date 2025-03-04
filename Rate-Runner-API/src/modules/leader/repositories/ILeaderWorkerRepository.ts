import { Token } from "typedi";
import { LeaderWorker } from "../models/LeaderWorker";

export interface ILeaderWorkerRepository {
    getLeaderWorker(caller_user_id: string): Promise<LeaderWorker[]>
    addLeaderWorker(leader_worker: LeaderWorker): Promise<any>
    delLeaderWorker(leader_worker: LeaderWorker): Promise<any>
}

export const LeaderWorkerToken = new Token<ILeaderWorkerRepository>();
