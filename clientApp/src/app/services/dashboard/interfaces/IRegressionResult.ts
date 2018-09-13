import { ITeams } from './ITeams';
import { IGroups } from './IGroups';
import { ITeamUseCase } from './ITeamUseCase';

export interface IRegressionResult {
    id: number;
    name: string;
    totalAssertions: number;
    successCount: number;
    failedCount: number;
    buildNumber: string;    
    dateCreated: any;
    serial: number;
    team: ITeams;
    group: IGroups;
    teamUseCase: ITeamUseCase;
    data: any;
}