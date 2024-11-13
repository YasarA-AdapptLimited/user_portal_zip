import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { AccountModule } from '../account/account.module';
import { CustomErrorHandler } from '../core/service/CustomErrorHandler';
// import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalDetailsStepComponent } from './steps/personalDetails/personalDetailsStep.component';
import { EqualityDiversityStepComponent } from './steps/equalityDiversity/equalityDiversityStep.component';
import { FtpDeclarationStepComponent } from './steps/declaration/ftpDeclarationStep.component';
import { RenewalModule } from '../renewal/renewal.module';
import { DeclarationSummaryComponent } from './steps/declaration/declarationSummary.component';
import { WorkExperienceStepComponent } from './steps/workExperience/workExperienceStep.component';
import { WorkExperienceComponent } from './steps/workExperience/workExperience.component';
import { TechnicianReviewStepComponent } from './steps/review/technicianReviewStep.component';
 import { TechnicianApplicationReviewComponent } from './steps/review/technicianApplicationReview.component';
import { PaymentStepComponent } from './steps/payment/paymentStep.component';
import { PaymentStepOldComponent } from './steps/payment/oldFlow/paymentStep.component';
import { SupportingDocumentsStepComponent } from './steps/supportingDocuments/supportingDocumentsStep.component';
import { TechnicianDetailsComponent } from './technicianDetails.component';
import { TechnicianDashboardComponent } from './steps/dashboard/technicianDashboard.component';
import { TechnicianRoutingModule } from './technician-routing.module';
import { TechnicianApplicationComponent } from './technicianApplication.component';
import { SelectPremisesComponent } from './steps/workExperience/selectPremises.component';
import { SelectRegistrantComponent } from './steps/workExperience/selectRegistrant.component';
import { ApplicationTypeStepComponent } from './steps/applicationType/applicationTypeStep.component';
import { EducationDetailsStepComponent } from './steps/educationDetails/educationDetailsStep.component';
import { AddressComponent } from './steps/personalDetails/address.component';
import { AddressEditComponent } from './steps/personalDetails/addressEdit.component';
import { AddressEditableComponent } from './steps/personalDetails/addressEditable.component';
import { AddressSearchComponent } from './steps/personalDetails/addressSearch.component';
import { PreviousApplicationsAndRegistrationsComponent } from './steps/prevApplicationAndRegistrations/previousApplicationsAndRegistrations.component';
import { CountersigningStepComponent } from './steps/countersigning/countersigningStep.component';
import { OverallDeclarationStepComponent } from './steps/declaration/overallDeclarationStep.component';
import { EducationDetailsSummaryComponent } from './steps/summary/educationDetailsSummary.component';
import { PreviousApplicationsAndRegistrationsSummaryComponent } from './steps/summary/previousApplicationsAndRegistrationsSummary.component'
import { FirstYearPaymentComponent } from './steps/firstYearPayment/firstYearPayment.component';
import { GuidanceComponent } from './steps/guidance/guidance.component';
import { FirstYearPaymentOldComponent } from './steps/firstYearPayment/oldFlow/firstYearPayment.component';


@NgModule({
  imports: [
    CommonModule,
    // HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    AccountModule,
    RenewalModule,
    TechnicianRoutingModule
  ],
  declarations: [
    TechnicianDashboardComponent,
    TechnicianDetailsComponent,
    TechnicianApplicationComponent,
    TechnicianApplicationReviewComponent,
    PersonalDetailsStepComponent,
    EqualityDiversityStepComponent,
    FtpDeclarationStepComponent,
    DeclarationSummaryComponent,
    TechnicianReviewStepComponent,
    PaymentStepComponent,
    PaymentStepOldComponent,
    SupportingDocumentsStepComponent,
    WorkExperienceStepComponent,
    WorkExperienceComponent,
    SelectPremisesComponent,
    SelectRegistrantComponent,
    ApplicationTypeStepComponent,
    EducationDetailsStepComponent,
    FirstYearPaymentComponent,
    FirstYearPaymentOldComponent,
    AddressComponent,
    PreviousApplicationsAndRegistrationsComponent,
    AddressEditComponent,
    AddressEditableComponent,
    AddressSearchComponent,
    CountersigningStepComponent,
    OverallDeclarationStepComponent,
    EducationDetailsSummaryComponent,
    PreviousApplicationsAndRegistrationsSummaryComponent,
    GuidanceComponent
  ],
  exports: [
    TechnicianDashboardComponent,
    TechnicianApplicationReviewComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ]
})
export class TechnicianModule { }
