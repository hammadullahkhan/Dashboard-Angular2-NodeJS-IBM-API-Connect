import { Component, Input, Output, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

//interfaces
import { ITeams } from '../../services/dashboard/interfaces/ITeams';
import { IRegressionResult } from '../../services/dashboard/interfaces/IRegressionResult';
import { IGroups } from '../../services/dashboard/interfaces/IGroups';

//services
import { RegressionResultService } from '../../services/dashboard/RegressionResult.service';
import { GroupService } from '../../services/dashboard/Group.service';

import { EventBusService } from '../../services/shared/event-bus.service';
import { TabsService } from '../../services/tabs/tabs.service';

import { PieChart } from '../PieChart/PieChart';

@Component({
    selector: 'regression-result',
    templateUrl: './RegressionResult.component.html',
    styleUrls: ['./RegressionResult.component.scss']
})
export class RegressionResultComponent implements OnInit, OnChanges {
    
    public items: any;
    public loading: boolean;
    public loadingText: string;
    public buildDate: string;
    public noData: boolean;
    public noDataMessage: string;
    public title: string;
    public titleOrignal: string;
    public buildNumber: string;
    public buildNumberText: string;
    public totalAssertions: number;
    public graph: boolean;

    @Output()
    public successCount: number;

    @Output()
    public failedCount: number;

    public passPercentage: number; 
    public orderby: string;
    public orderbyType: boolean;
    public buildNumbers: any;
    sub:any;
    public groupName: string;

    public pieChartLabels:string[];
    public pieChartData:number[];
    public pieChartType:string;
    public lineChartOptions:any;
    
    constructor(private regressionResultService: RegressionResultService, 
        private groupService: GroupService,
        private route:ActivatedRoute,
        private eventBusService: EventBusService) {

        /*this.groupService.seletedGroup$.subscribe(
            data => {
                this.refresh();
                this.title = data.preetyName;
                this.getDataByGroup(data, this.buildNumber);                
                this.loading = false;
            }
        );*/
    }

    ngOnChanges() {
    }

    ngOnInit() {
        this.noData = false;
        this.noDataMessage = "No Result(s) found.";

        this.loading = true;
        this.loadingText = "Please click on report group on the sidebar to start with";
        
        this.refresh();
        
        this.sub = this.route.params.subscribe(params => {
            this.refresh();
            this.titleOrignal = params['name'];
            this.title = this.getPreetyName(params['name']);
            this.groupName = params['name'];
            this.getBuildNumbers(this.groupName);
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
            }],
                tabs: TabsService.getTabsData()
            });
    }

    refresh(): void {
        
        this.buildNumber = "";
        this.buildNumberText = "Build # ";
        this.buildDate = null;
        this.totalAssertions = 0;
        this.successCount = 0;
        this.failedCount = 0;
        this.passPercentage = 0;
        this.items = [];
        this.noData = false; 
        this.orderby = "name";
        this.orderbyType = false;
        this.graph = false;
    }

    toggleGraph(): void {
        this.graph = !this.graph;
    }

    onBuildChange(buildNumber: string) {
        
        this.refresh();
        this.buildNumber = buildNumber;        
        this.getDataByGroup( this.groupName, this.buildNumber );
        this.loading = false;
    }

    getPreetyName (name: string) : string {

        return name.replace('_', ' ');
    }

    getPassFailStyle(): string {
        let str = "good";
        
        if ( this.passPercentage <= 80 ) {
            str = "bad";
        }
        if ( this.successCount == 0 && this.failedCount == 0 ) {
            str = "";
        }
                
        return str;
    }

    /*private getRowClass(serial: number): string {
        let str = "";
        str = (serial%2 === 0 ) ? "even-row" : "odd-row";
        return str;
    }*/

    getTableHeaderStyle(field: string): string {
        let str = "";

        if ( this.orderby == field && this.orderbyType ) {
            str = "chevron-up";
        } 
        else if ( this.orderby == field && !this.orderbyType ) {
            str = "chevron-down";
        }
        
        return str;
    }

    trackByFn(index: number, item: IRegressionResult) {
        item.serial = index+1;
        return item.serial;
    }

    orderByField(field: string): void {

        this.orderby = field;
        this.orderbyType = !this.orderbyType;  
    }

    getBuildNumbers(groupName: string): void {

        this.regressionResultService
            .GetBuildNumbers(groupName)
            .subscribe(
            data => {
                    this.buildNumbers = data;
                    this.buildNumbers = this.buildNumbers.result.data;
                    this.buildNumber = this.buildNumbers[this.buildNumbers.length -1];
                    
                    this.getDataByGroup( this.groupName, this.buildNumber );
                    this.loading = false;
            }/* ,
            error => console.log(error),
            () =>                 
                console.log('GET/testResults completed') */
            );
    }

    getDataByGroup(group: string, buildNumber: string): void {

        let filter = JSON.stringify({"where":{"buildNumber":buildNumber ,"group.name": group}});
        this.regressionResultService
            .GetAll(filter)
            .subscribe(
            data => {

                if ( data.length <= 0 ) { 
                    this.noData = true; 
                }
                else {
                    
                    this.items = data;
                    for (let item of this.items) {
                        
                        item.serial = item.serial + 1;                        
                        item.mappedFileName = item.teamUseCase.mappedFileName;
                        item.teamName = item.team.name;
                        
                        let dt = new Date(item.dateCreated);
                        this.buildDate = dt.toLocaleString();

                        item.totalAssertions = parseInt(item.totalAssertions);
                        item.successCount = parseInt(item.successCount);
                        item.failedCount = parseInt(item.failedCount);

                        if ( !isNaN(item.totalAssertions) ) { this.totalAssertions += parseInt(item.totalAssertions); }
                        if ( !isNaN(item.successCount) ) { this.successCount += parseInt(item.successCount); }
                        if ( !isNaN(item.failedCount) ) { this.failedCount += parseInt(item.failedCount); }
                    }
                    this.passPercentage = ( (this.successCount - this.failedCount) / this.successCount ) * 100;
                    this.passPercentage = parseFloat(this.passPercentage.toFixed(2));

                    
                    this.pieChartLabels = ['Success', 'Failed'];
                    this.pieChartData = [this.successCount, this.failedCount];
                    this.pieChartType = 'pie';
                    this.lineChartOptions = {
                        responsive: true,
                        maintainAspectRatio: false
                    };


                }                
            }/* ,
            error => console.log(error),
            () =>                 
                console.log('GET/testResults completed') */
            );
    }
}