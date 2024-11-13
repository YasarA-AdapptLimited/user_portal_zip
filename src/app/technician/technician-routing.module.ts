import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInOnlyGuard } from '../guard/LoggedInOnly.guard';
import { UserLoadedGuard } from '../guard/UserLoaded.guard';
import { PreregOnlyGuard } from '../guard/PreregOnly.guard';
import { NewWorldpayGuard } from '../guard/NewWorldpay.guard';
import { OldWorldpayGuard } from '../guard/OldWorldpay.guard';
import { CanDeactivateGuard } from '../guard/CanDeactivate.guard';
import { TechnicianOnlyGuard } from '../guard/TechnicianApplicantOnly.guard';
import { TechnicianDetailsComponent } from './technicianDetails.component';
import { TechnicianApplicationComponent } from './technicianApplication.component';
import { FirstYearPaymentComponent } from './steps/firstYearPayment/firstYearPayment.component';
import { FirstYearPaymentOldComponent } from './steps/firstYearPayment/oldFlow/firstYearPayment.component';


const routes: Routes = [
  {
    path: 'technicianDetails',
    canActivate: [ UserLoadedGuard, LoggedInOnlyGuard, TechnicianOnlyGuard ],
    component: TechnicianDetailsComponent,
    data: { title: 'Technician details' }
  },
  {
    path: 'application',
    canActivate: [ UserLoadedGuard, LoggedInOnlyGuard, TechnicianOnlyGuard ],
    component: TechnicianApplicationComponent,
    data: { title: 'Technician Application' , classname : 'application' }
  },
  { 
    path: 'application/first-year-payment',
    canActivate: [ UserLoadedGuard, LoggedInOnlyGuard,TechnicianOnlyGuard, NewWorldpayGuard],
    data: { title: 'First year payment', classname : 'application' },
    component: FirstYearPaymentComponent 
  },
  { 
      path: 'application/first-year-payment2',
      canActivate: [ UserLoadedGuard, LoggedInOnlyGuard,TechnicianOnlyGuard, OldWorldpayGuard],
      data: { title: 'First year payment', classname : 'application' },
      component: FirstYearPaymentOldComponent 
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    UserLoadedGuard,
    LoggedInOnlyGuard,
    PreregOnlyGuard,
    CanDeactivateGuard,
    TechnicianOnlyGuard
  ]
})
export class TechnicianRoutingModule { }
