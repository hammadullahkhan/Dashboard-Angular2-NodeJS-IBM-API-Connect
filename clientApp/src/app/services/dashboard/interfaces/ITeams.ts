import { IGroups } from './IGroups';

export interface ITeams {
    id: number;
    name: string;
    email: string;
    group: IGroups;
    dateCreated: any;    
}