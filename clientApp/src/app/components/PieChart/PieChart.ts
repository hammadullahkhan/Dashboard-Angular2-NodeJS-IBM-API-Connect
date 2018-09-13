//import { Component, Input, OnInit } from '@angular/core';
import { AfterViewInit, Component, HostBinding, OnDestroy, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ChartData } from '@ericsson/oden/core';

@Component({
    selector: 'pie-chart',
    templateUrl: './PieChart.html',
    styleUrls: ['./PieChart.scss'],
})
export class PieChart implements OnInit {
    
    public pieChartLabels:string[];
    public pieChartData:ChartData[];
    public pieChartType:string;
    public lineChartOptions:any;
    @Input() success: number;
    @Input() failed: number;
    
    constructor() {
    }

    getPieChartDataItems(): Array<ChartData> {
        return [
            new ChartData({value: this.success, label: 'Success', id: 'Success'}),
            new ChartData({value: this.failed, label: 'Failed', id: 'Failed'}),
        ];
    }

    ngOnInit() {
        this.pieChartData = this.getPieChartDataItems();
        this.pieChartType = 'pie';
        this.lineChartOptions = {
            responsive: true,
            maintainAspectRatio: false
        };
    }

    // events
    public chartClicked(e:any):void {
        //console.log(e);
    }
    
    public chartHovered(e:any):void {
        //console.log(e);
    }
}