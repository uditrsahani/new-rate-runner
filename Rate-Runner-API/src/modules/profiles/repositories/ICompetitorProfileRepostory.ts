import { Token } from "typedi";
import { Competitor } from "../models/CompetitorProfile";

export interface ICompetitorProfileRepository {
    getCompetitor(): Promise<Competitor[]>
    addCompetitor(competitor: Competitor): Promise<any>
    updateCompetitor(ct_id: string, competitor: Competitor): Promise<any>
}

export const CompetitorProfileRepositoryToken = new Token<ICompetitorProfileRepository>()
