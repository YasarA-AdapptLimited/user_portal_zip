import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegApplicationComponent } from './regApplication.component';
import { AssessmentReportComponent } from './assessment-report/assessmentReport.component';
import { LoggedInOnlyGuard } from '../guard/LoggedInOnly.guard';
import { UserLoadedGuard } from '../guard/UserLoaded.guard';
import { PreregOnlyGuard } from '../guard/PreregOnly.guard';
import { CanDeactivateGuard } from '../guard/CanDeactivate.guard';
import { FirstYearPaymentComponent } from './firstYearPayment.component';
import { PreregComponent } from './prereg.component';
import { PastApplicationComponent } from './pastApplication.component';
import { AssessmentRegistrationComponent } from './assessment-registration/assessmentRegistrationApplication.component';
import { FinalDeclarationComponent } from './final-declaration/finalDeclaration.component';
import { FirstYearPaymentOldComponent } from './paymentOldFlow/firstYearPayment.component';
import { NewWorldpayGuard } from '../guard/NewWorldpay.guard';
import { OldWorldpayGuard } from '../guard/OldWorldpay.guard';

//import { ArosApplicationComponent } from './arosApplication.component';


const routes: Routes = [
  {
    path: 'pastApplication/:id',
    component: PastApplicationComponent,
    canActivate: [UserLoadedGuard, LoggedInOnlyGuard, PreregOnlyGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: PreregComponent,
    canActivate: [UserLoadedGuard, LoggedInOnlyGuard, PreregOnlyGuard]
  },
  {
    path: 'application', canActivate: [UserLoadedGuard, LoggedInOnlyGuard,
      PreregOnlyGuard], data: { title: 'Application for registration', classname: 'application' },
    canDeactivate: [CanDeactivateGuard],
    component: RegApplicationComponent
  },
  /* { path: 'aros-application', canActivate: [ UserLoadedGuard, LoggedInOnlyGuard,
     PreregOnlyGuard], data: { title: 'Application for registration', classname : 'application' },
   canDeactivate: [ CanDeactivateGuard ],
   component: ArosApplicationComponent },*/
  {
    path: 'application/first-year-payment', canActivate: [UserLoadedGuard, LoggedInOnlyGuard,
      PreregOnlyGuard, NewWorldpayGuard], data: { title: 'First year payment', classname: 'application' },
    component: FirstYearPaymentComponent
  },
  {
    path: 'application/first-year-payment2', canActivate: [UserLoadedGuard, LoggedInOnlyGuard,
      PreregOnlyGuard, OldWorldpayGuard], data: { title: 'First year payment', classname: 'application' },
    component: FirstYearPaymentOldComponent
  },
  {
    path: 'assessment-report', canActivate: [UserLoadedGuard, LoggedInOnlyGuard,
      PreregOnlyGuard], data: { title: 'Application for progress report', classname: 'application' },
    canDeactivate: [CanDeactivateGuard],
    component: AssessmentReportComponent
  },
  {
    path: 'assessment-registration', canActivate: [UserLoadedGuard, LoggedInOnlyGuard,
      PreregOnlyGuard], data: { title: 'Application to sit the registration assessment', classname: 'application' },
    canDeactivate: [CanDeactivateGuard],
    component: AssessmentRegistrationComponent
  },
  {
    path: 'final-declaration', canActivate: [UserLoadedGuard, LoggedInOnlyGuard,
      PreregOnlyGuard], data: { title: '52 week final declaration', classname: 'application' },
    canDeactivate: [CanDeactivateGuard],
    component: FinalDeclarationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    UserLoadedGuard,
    LoggedInOnlyGuard,
    PreregOnlyGuard,
    CanDeactivateGuard
  ]
})
export class PreregRoutingModule { }
