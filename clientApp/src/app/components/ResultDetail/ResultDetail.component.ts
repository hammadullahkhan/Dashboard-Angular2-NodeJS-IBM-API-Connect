import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

//interfaces
import { ITeams } from '../../services/dashboard/interfaces/ITeams';

//services
import { TeamUseCaseService } from '../../services/dashboard/TeamUseCase.service';

import { EventBusService } from '../../services/shared/event-bus.service';
import { TabsService } from '../../services/tabs/tabs.service';


@Component({
    selector: 'result-detail',
    templateUrl: './ResultDetail.component.html',
    styleUrls: ['./ResultDetail.component.scss']
})
export class ResultDetailComponent implements OnInit, OnChanges {
    
    public loading: boolean;
    public loadingText: string;
    public noData: boolean;
    public noDataMessage: string;
    public title: string;
    public titleOrignal: string;
    public fileName: string;
    public fileContent: string;
    public fileTypes: any;
    public fileType: string;
    public subTitle: string;
    sub:any;
    
    constructor(
        private teamUseCaseService: TeamUseCaseService,
        private route:ActivatedRoute,
        private eventBusService: EventBusService ) {        
    }

    ngOnChanges() {
    }
    
    ngOnInit() {        
        this.noData = false;
        this.noDataMessage = "No Result(s) found.";

        this.loading = true;
        this.loadingText = "Loading File ...";

        this.fileTypes = ['HTML', 'JSON'];        
        this.refresh();
        
        this.sub = this.route.params.subscribe(params => {

            this.refresh();
            this.titleOrignal = params['name'];
            this.title = this.getPreetyName(params['name']);
            this.fileName = params['fileName'];     
            this.subTitle = this.getSubTitle(this.fileName);
            this.fileName = this.getFileName(this.fileName, this.fileType);     
            this.getFile(this.fileName);
            this.setPageHeaderConfigurations();
        });
    }

    setPageHeaderConfigurations() {
        this.eventBusService.publish('HeaderConfiguration',
            {
                title: this.title,
                breadCrumbData: [{
                id: 1,
                path: '/dashboard/report/',
                title: 'Dashboard'
            }, {
                id: 2,
                path: '/dashboard/report/',
                title: 'Reports'
            }, {
                id: 3,
                path: '/dashboard/report/'+ encodeURIComponent(this.titleOrignal),
                title: this.title
            }, {
                id: 4,
                path: '/dashboard/report/'+ encodeURIComponent(this.titleOrignal) + '/details/' + encodeURIComponent(this.fileName),
                title: 'Details'
            }],
                //tabs: TabsService.getTabsData()
            });
    }

    refresh(): void {
        this.noData = false;   
        this.fileContent = "";
        this.fileType = "HTML";
    }

    getFileName(fileName: string, fileType: string): string {
        
        let idx = fileName.lastIndexOf(".");
        return fileName = fileName.substr(0, idx) + '.' + fileType.toLowerCase();        
    }

    onFileTypeChange(fileType: string) {
        
        this.refresh();
        this.fileType = fileType;
        this.fileName = this.getFileName(this.fileName, this.fileType);
        this.getFile(this.fileName);
        this.loading = false;
    }

    getPreetyName (name: string) : string {

        name = name.replace('_', ' ');
        return name;
    }

    getSubTitle (name: string) : string {

        let temp = name.split('/');
        name = temp && temp[1] ? temp[1] : name;
        return name;
    }

    downloadJSON(): void {
        
        this.fileName = this.getFileName(this.fileName, 'json');
        //console.log('download json', this.fileName)
        this.downloadJson(this.fileName);
    }

    downloadJson(fileName: string): void {

        this.teamUseCaseService
            .DownloadJSON(fileName)
            .subscribe(
            data => {
                                 
            }/* ,
            error => console.log(error),
            () =>                 
                console.log('GET/testResults completed') */
            );
    }

    getFile(fileName: string): void {
        
        this.getFileServer(fileName);
    }

    getFileServer(fileName: string): void {

        this.teamUseCaseService
            .GetFile(fileName)
            .subscribe(
            data => {
                    this.loading = false;
                    let tempData : any = data;
                    let fileContent : string = "";
                    let jObj: any = JSON.parse(tempData._body);
                    fileContent = jObj.result.data;
                    this.formatFileContent(fileContent);                    
            }/* ,
            error => console.log(error),
            () =>                 
                console.log('GET/testResults completed') */
            );
    }

    formatFileContent(fileContent: string): void {
        
        switch(this.fileType) {
            case "HTML":
                this.fileContent = fileContent;
            break;
            case "JSON":
                this.fileContent = JSON.stringify(JSON.parse(fileContent),null,2);  
            break;
            case "XML":
                this.fileContent = fileContent;
            break;
        }
    }
    
}