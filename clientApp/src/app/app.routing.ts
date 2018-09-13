import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent }   from './components/home/home.component';
import { REGRESSIONRESULT_CONFIG }   from './config/index';


const routes: Routes = [
    { path: '', component: HomeComponent, data: {mainMenu: true },
children: [
    ...REGRESSIONRESULT_CONFIG.routes,
    { path: '', redirectTo: '/dashboard/report/RM_Newman' }
]}
];

@NgModule({
    imports: [ RouterModule.forChild(routes)],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}


