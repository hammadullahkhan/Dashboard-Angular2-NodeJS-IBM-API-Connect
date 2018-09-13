import { RegressionResultComponent } from '../components/RegressionResult/RegressionResult.component';
import { ResultDetailComponent } from '../components/ResultDetail/ResultDetail.component';
import { PieChart } from '../components/PieChart/PieChart';
import { GroupService } from '../services/dashboard/Group.service';
import { RegressionResultService } from '../services/dashboard/RegressionResult.service';
import { TeamUseCaseService } from '../services/dashboard/TeamUseCase.service';

export const REGRESSIONRESULT_CONFIG = {
    routes: [
        {
            path: 'report/:name',
            children: [
                { path: '', component: RegressionResultComponent }/*,
                { path: 'details/:fileName', component: ResultDetailComponent }*/
            ]
        },
        {
            path: 'report/:name/details/:fileName',
            children: [
                { path: '', component: ResultDetailComponent }
            ]
        }
    ],
    declaration: [
        RegressionResultComponent,
        ResultDetailComponent,
        PieChart
    ],
    providers: [
        GroupService,
        RegressionResultService,
        TeamUseCaseService
    ]
};

/*{
    path: 'report/:name/viewFile/:fileName',
    component: ViewFile,
  }*/