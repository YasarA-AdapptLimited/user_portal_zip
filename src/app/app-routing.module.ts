import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { EmailConfirmationComponent } from './account/emailConfirmation.component';
import { AccountActivationComponent } from './account/activation/accountActivation.component';
import { LoginComponent } from './account/login.component';
import { LoggedInOnlyGuard } from './guard/LoggedInOnly.guard';
import { UserLoadedGuard } from './guard/UserLoaded.guard';
import { RegistrantsOnlyGuard } from './guard/RegistrantsOnly.guard';
import { NewWorldpayGuard } from './guard/NewWorldpay.guard';
import { OldWorldpayGuard } from './guard/OldWorldpay.guard';
import { CanDeactivateGuard } from './guard/CanDeactivate.guard';
import { ReviewersOnlyGuard } from './guard/ReviewersOnly.guard';
import { AccountActivationGuard } from './guard/AccountActivation.guard';
import { AppComponent } from './app.component';
import { DiagnosticsComponent } from './core/diagnostics.component';
import { NotFoundComponent } from './core/notFound.component';
import { PrivacyPolicyComponent } from './core/privacyPolicy.component';
import { HomeComponent } from './home.component';
import { RenewalComponent } from './renewal/renewal.component';
import { RenewalOldComponent } from './renewal/renewalPaymentOldFlow/renewal.component';
import { RenewalFaqComponent } from './renewal/renewalFaq.component';
import { ReceiptsComponent } from './payment/receipts.component';
import { RegistrationComponent } from './registration/registration.component';
import { SigninFaqComponent } from './account/signinFaq.component';
import { NotificationsComponent } from './account/notifications/notifications.component';
import { ReceiptComponent } from './payment/receipt.component';

import { CountersignComponent } from './registration/countersign.component';
import { LetterComponent } from './registration/letter.component';
import { LetterGuard } from './guard/Letter.guard';
import { NotRevalidationExemptGuard } from './guard/NotRevalidationExempt.guard';
import { LearningContractResponseComponent } from './registration/learningContractResponse.component';
import { TechnicianConfirmationComponent } from './account/activation/technician-confirmation.component';
import { PreregAssessmentRegistrationGuard } from './guard/preregAssessmentRegistration.guard';
import { MsalGuard } from '@azure/msal-angular';
import { PreregOnlyGuard } from './guard/PreregOnly.guard';
import { StudentsOnlyGuard } from './guard/StudentsOnly.guard';
import { TechnicianOnlyGuard } from './guard/TechnicianApplicantOnly.guard';
import { IndependentPrescriberApplicationComponent } from './registration/independent-precriber/independentPrescriberApplication.component';
import { ApplicationsDashboardComponent } from './registration/applicationsDashboard.component';
import { VoluntaryRemovalComponent } from './registration/voluntary-removal/voluntary-removal.component';
import { CcpsComponent } from './registration/ccps/ccps.component';
import { PaymentSuccessComponent } from './shared/worldpay/paymentSuccess.component';
import { PaymentFailureComponent } from './shared/worldpay/paymentFailure.component';
import { PaymentCancelledComponent } from './shared/worldpay/paymentCancelled.component';
import { ReturnToRegisterComponent } from './registration/return-to-register/return-to-register-application.component';
import { RestorationFeePaymentComponent } from './registration/restorationFeePayment.component';
import { RestorationFeePaymentOldComponent } from './registration/restorationFeePaymentOldFlow/restorationFeePayment.component';

export function isInIframe() {
  return window !== window.parent && !window.opener;
}

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'null',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', canActivate: [UserLoadedGuard], component: HomeComponent, data: { title: 'Home' } },
  { path: 'signin', component: LoginComponent, data: { title: 'Sign in' } },
  { path: 'signin/faq', component: SigninFaqComponent, data: { title: 'Sign in FAQ' } },
  { path: 'privacy', component: PrivacyPolicyComponent, data: { title: 'Privacy policy' } },
  { path: 'account', canActivate: [UserLoadedGuard, MsalGuard], component: AccountComponent, data: { title: 'Account' } },
  {
    path: 'account/notifications', canActivate: [UserLoadedGuard], component: NotificationsComponent,
    data: { title: 'Notifications', classname: 'soft-background' }
  },
  {
    path: 'account/activate', canActivate: [AccountActivationGuard],
    component: AccountActivationComponent, data: { title: 'Activate your account' }
  },
  {
    path: 'account/confirm', canActivate: [MsalGuard],
    component: TechnicianConfirmationComponent,
    data: {
      title: 'Confirm your account'
    }
  },
  { path: 'receipts', canActivate: [UserLoadedGuard], component: ReceiptsComponent, data: { title: 'Receipts' } },
  { path: 'receipts/:id', canActivate: [UserLoadedGuard], component: ReceiptComponent, data: { title: 'View receipt' } },
  { path: 'email-confirmation', component: EmailConfirmationComponent, data: { title: 'Email confirmation' } },
  {
    path: 'registration', canActivate: [UserLoadedGuard, RegistrantsOnlyGuard],
    component: RegistrationComponent, data: { title: 'Registration' }
  },

  {
    path: 'registration/letter/:letterType', canActivate: [UserLoadedGuard, LetterGuard],
    component: LetterComponent
  },
  {
    path: 'registration/letter/:letterType/:id', canActivate: [UserLoadedGuard, LetterGuard],
    component: LetterComponent
  },
  {
    path: 'registration/countersign/:id/:role',
    canActivate: [
      UserLoadedGuard,
      RegistrantsOnlyGuard],
    component: CountersignComponent,
    data: { title: 'Countersign application' }
  },
  {
    path: 'registration/learning-contract/sign/:id', canActivate: [UserLoadedGuard, RegistrantsOnlyGuard],
    component: LearningContractResponseComponent, data: { title: 'Learning contract response' }
  },
  {
    path: 'revalidation',
    canActivate: [UserLoadedGuard, RegistrantsOnlyGuard, NotRevalidationExemptGuard], data: { title: 'Revalidation' },
    loadChildren: () => import('./revalidation/revalidation.module').then(m => m.RevalidationModule)
  },
  {
    path: 'renewal', canActivate: [UserLoadedGuard, RegistrantsOnlyGuard, NewWorldpayGuard], component: RenewalComponent, data: { title: 'Renewal' },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'renewal2', canActivate: [UserLoadedGuard, RegistrantsOnlyGuard, OldWorldpayGuard], component: RenewalOldComponent, data: { title: 'Renewal' },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'renewal/faq', canActivate: [UserLoadedGuard, RegistrantsOnlyGuard],
    component: RenewalFaqComponent, data: { title: 'Renewal FAQ' }
  },
  { path: 'diagnostics', component: DiagnosticsComponent, data: { title: 'Diagnostics' } },
  {
    path: 'review',
    data: { title: 'Review' },
    canActivate: [UserLoadedGuard, ReviewersOnlyGuard],
    loadChildren: () => import('./review/review.module').then(m => m.ReviewModule)
  },
  {
    path: 'student', canActivate: [UserLoadedGuard], loadChildren: () => import('./student/student.module').then(m => m.StudentModule)
  },
  {
    path: 'prereg', canActivate: [UserLoadedGuard],
    loadChildren: () => import('./prereg/prereg.module').then(m => m.PreregModule)
    // loadChildren: () => import('src/app/prereg/prereg.module#PreregModule').then(m => m.PreregModule)
  },
  {
    path: 'technician', canActivate: [UserLoadedGuard, TechnicianOnlyGuard],
    loadChildren: () => import('./technician/technician.module').then(m => m.TechnicianModule)
    // loadChildren: () => import('./technician/technician.module').then(m => m.TechnicianModule)
  },
  {
    path: 'assessment/registration',
    canActivate: [UserLoadedGuard, RegistrantsOnlyGuard, PreregAssessmentRegistrationGuard, MsalGuard], data: { title: 'Application' },
    loadChildren: () => import('./prereg/prereg.module').then(m => m.PreregModule)
  },
  {
    path: 'application',
    canActivate: [UserLoadedGuard, RegistrantsOnlyGuard], 
    component: ApplicationsDashboardComponent, data: { title: 'Application'},

  },
  {
    path: 'independentPrescriber/application', canActivate: [UserLoadedGuard, RegistrantsOnlyGuard],
    component: IndependentPrescriberApplicationComponent, data: { title: 'Independent Prescriber', classname: 'application' }
  },
  {
    path: 'voluntaryRemoval/application', canActivate: [UserLoadedGuard, RegistrantsOnlyGuard],
    component: VoluntaryRemovalComponent, data: { title: 'Voluntary removal of your register entry', classname: 'application' }
  },
  {
    path: 'ccps/application/:id', canActivate: [UserLoadedGuard, RegistrantsOnlyGuard],
    component: CcpsComponent, data: { title: 'Certificate of current professional status & fitness to practice history request', classname: 'application' }
  },
  {
    path: 'ccps/application', canActivate: [UserLoadedGuard, RegistrantsOnlyGuard],
    component: CcpsComponent, data: { title: 'Certificate of current professional status & fitness to practice history request', classname: 'application' }
  },
  { path: 'paymentSuccess', component: PaymentSuccessComponent, data: { title: 'Payment Success' } },
  { path: 'paymentFailure', component: PaymentFailureComponent, data: { title: 'Payment Failure' } },
  { path: 'paymentCancelled', component: PaymentCancelledComponent, data: { title: 'Payment Cancelled' } },
  {
    path: 'returnToRegister/application', canActivate: [UserLoadedGuard, RegistrantsOnlyGuard],
    component: ReturnToRegisterComponent, data: { title: 'Application for restoration to the register', classname: 'application' }
  },
  {
    path: 'returnToRegister/application/restoration-payment', canActivate: [UserLoadedGuard, RegistrantsOnlyGuard, NewWorldpayGuard],
    component: RestorationFeePaymentComponent, data: { title: 'Restoration fee payment', classname: 'application' }
  },

  {
    path: 'returnToRegister/application/restoration-payment2', canActivate: [UserLoadedGuard, RegistrantsOnlyGuard, OldWorldpayGuard],
    component: RestorationFeePaymentOldComponent, data: { title: 'Restoration fee payment', classname: 'application' }
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {initialNavigation: 
    !isInIframe() ? "enabledNonBlocking" : "disabled"})],
  exports: [RouterModule],
  providers: [
    UserLoadedGuard,
    LoggedInOnlyGuard,
    RegistrantsOnlyGuard,
    ReviewersOnlyGuard,
    CanDeactivateGuard,
    NotRevalidationExemptGuard,
    AccountActivationGuard,
    StudentsOnlyGuard,
    TechnicianOnlyGuard,
    MsalGuard,
    NewWorldpayGuard,
    OldWorldpayGuard
  ]
})
export class AppRoutingModule { }
