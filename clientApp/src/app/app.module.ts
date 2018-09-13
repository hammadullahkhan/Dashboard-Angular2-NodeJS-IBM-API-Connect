import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './app.routing';
import { OdenModule } from '@ericsson/oden/modules';
import { LoggerModule } from '@ericsson/cus-ui/logger';
import { BaseService } from './services/shared/base.service';
import { EventBusService } from './services/shared/event-bus.service';
import { CanDeactivateGuard } from './services/guards/can-deactivate-guard.service';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { REGRESSIONRESULT_CONFIG } from './config/index';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
    imports: [
        AppRoutingModule,
        OdenModule,
        LoggerModule,
        CommonModule,
        FormsModule,
        OrderModule
        ],
    declarations: [
        HomeComponent,
        ...REGRESSIONRESULT_CONFIG.declaration
        ],
  providers: [
        BaseService,
        EventBusService,
        CanDeactivateGuard,
        ...REGRESSIONRESULT_CONFIG.providers
  ],
})

export class AppModule { }
