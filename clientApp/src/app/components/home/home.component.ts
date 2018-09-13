import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderConfig } from '@ericsson/oden/components/loader/loader.config';
import { BreadcrumbItem } from '@ericsson/oden/core/models/breadcrumb.item';
import { TabsInterface } from '@ericsson/oden/core/interfaces/tabs.interface';
import { TAB_VIEW } from '@ericsson/oden/modules';
import { LoggerService } from '@ericsson/cus-ui/logger';
import { EventBusService } from '../../services/shared/event-bus.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss'],
    animations: [TAB_VIEW.ANIMATION]
})

export class HomeComponent implements OnInit, OnDestroy {
    @HostBinding('@routeAnimation') animationDirection: string;
    tabLoader: LoaderConfig;
    breadcrumb: Array<BreadcrumbItem>;
    app_title: string;
    tabs: TabsInterface;

    constructor(private router: Router,
        private eventBusService: EventBusService,
        private _logger: LoggerService) {

        this.tabLoader = new LoaderConfig({
            text: 'Loading tab...',
            isTabLoader: true
        });
        this._logger.debug(`Dashboard loaded successfully`);
    }

    ngOnInit() {
        this.eventBusService.subscribe('HeaderConfiguration', (configuration) => {
            this.app_title = configuration.title ? configuration.title : '';
            this.tabs = ( configuration.tabs === undefined || configuration.tabs.length === 0 ) ?  [] : configuration.tabs;
            this.breadcrumb = (configuration.breadCrumbData) ? configuration.breadCrumbData : [];
        });
    }

    onClose(e) {
        this.router.navigate(['']);
    }

    ngOnDestroy() {
        this.eventBusService.unsubscribe('HeaderConfiguration');
    }
}
