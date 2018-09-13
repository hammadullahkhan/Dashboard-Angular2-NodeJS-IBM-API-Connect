import { ITeams } from './ITeams';
import { IGroups } from './IGroups';

export interface ITeamUseCase {
    id: number;
    name: string;
    preetyName: string;
    mappedFileName: "string";
    dateCreated: any;
    team: ITeams;
    group: IGroups;
    remoteMethod: any;
    getFile: any;    
    downloadFile: any;
}