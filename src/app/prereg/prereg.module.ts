import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { AccountModule } from '../account/account.module';
import { PreregDashboardComponent } from './preregDashboard.component';
import { RegApplicationComponent } from './regApplication.component';

import { PreregComponent } from './prereg.component';
import { CustomErrorHandler } from '../core/service/CustomErrorHandler';
import { PreregRoutingModule } from './prereg.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalDetailsStepComponent } from './steps/personalDetailsStep.component';

import { FtpDeclarationStepComponent } from './steps/declaration/ftpDeclarationStep.component';
import { DeclarationSummaryComponent } from './steps/declaration/declarationSummary.component';
import { EqualityDiversityStepComponent } from './steps/equalityDiversityStep.component';

import { OverallDeclarationStepComponent } from './steps/declaration/overallDeclarationStep.component';
import { ConfirmTrainingStepComponent } from './steps/training/confirmTrainingStep.component';
import { PaymentStepComponent } from './steps/paymentStep.component';
import { PaymentStepOldComponent } from './steps/paymentOldFlow/paymentStep.component';
import { SubmitStepComponent } from './steps/submitStep.component';
import { ReviewStepComponent } from './steps/reviewStep.component';
import { TraineePlacementComponent } from './steps/training/traineePlacement.component';
import { LetterStepComponent } from './steps/letterStep.component';
import { RegApplicationReviewComponent } from './steps/regApplicationReview.component';
import { CountersigningStepComponent } from './steps/countersigning/countersigningStep.component';
import { FirstYearPaymentComponent } from './firstYearPayment.component';
import { FirstYearPaymentOldComponent } from './paymentOldFlow/firstYearPayment.component';
import { PastApplicationComponent } from './pastApplication.component';
import { RenewalModule } from '../renewal/renewal.module';
import { LetterSummaryComponent } from './steps/letterSummary.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SupportingDocumentsStepComponent } from './steps/supportingDocumentsStep.component';

// Assessment report
import { AssessmentReportComponent } from './assessment-report/assessmentReport.component';
//import { AssessmentReportPersonalDetailsStepComponent } from './assessment-report/steps/personalDetails/assessmentReportPersonalDetailsStep.component';

import { AssessmentReportTraineePlacementComponent } from './assessment-report/steps/training/assessmentReportTraineePlacement.component';
import { AssessmentReportConfirmTrainingStepComponent } from './assessment-report/steps/training/assessmentReportConfirmTrainingStep.component';

import { AssessmentReportCountersigningStepComponent } from './assessment-report/steps/countersigning/assessmentReportCountersigningStep.component';
import { AssessmentReportSubmitStepComponent } from './assessment-report/steps/submit/assessmentReportSubmitStep.component';
import { AssessmentReportReviewComponent } from './assessment-report/steps/review/assessmentReportReview.component';
import { AssessmentReportReviewStepComponent } from './assessment-report/steps/review/assessmentReportReviewStep.component';

import { AssessmentReportTemporaryRegistrationStepComponent } from './assessment-report/steps/temporaryRegistration/assessmentReportTemporaryRegistrationStep.component';
import { AssessmentReportDeclarationSummaryComponent } from './assessment-report/steps/declaration/assessmentReportDeclarationSummary.component';
import { AssessmentReportFtpDeclarationStepComponent } from './assessment-report/steps/declaration/assessmentReportFtpDeclarationStep.component';
import { AssessmentReportOverallDeclarationStepComponent } from './assessment-report/steps/declaration/assessmentReportOverallDeclarationStep.component';

//import { ArosApplicationComponent } from './arosApplication.component';
import { TraineeAssessmentComponent } from './steps/training/traineeAssessment.component';

import { SittingConfirmationComponent } from './steps/sittingConfirmation/sittingConfirmationStep.component';
import { AssessmentRegistrationComponent } from './assessment-registration/assessmentRegistrationApplication.component';
import { AssessmentRegistrationDeclarationComponent } from './assessment-registration/steps/declarations/assessmentRegistrationDeclaration.component';
import { AssessmentRegistrationReviewComponent } from './assessment-registration/steps/review/assessmentRegistrationReview.component';
import { AssessmentRegistrationPaymentStepComponent } from './assessment-registration/steps/payment/assessmentRegistrationPaymentStep.component';
import { AssessmentRegistrationPaymentStepOldComponent } from './assessment-registration/steps/payment/oldFlow/assessmentRegistrationPaymentStep.component';
import { AssessmentRegistrationPersonalDetailsComponent } from './assessment-registration/steps/personalDetails/assessmentRegistrationPersonalDetails.component';
import { AssessmentRegistrationReviewStepComponent } from './assessment-registration/steps/review/assessmentRegistrationReviewStep.component';
import { AssessmentRegistrationSubmitComponent } from './assessment-registration/steps/submit/assessmentRegistrationSubmit.component';
import { AssessmentRegistrationSupportingDocumentsStepComponent } from './assessment-registration/steps/supportingDocuments/assessmentRegistrationSupportingDocumentsStep.component';
import { AssessmentRegistrationRegulationStepComponent } from './assessment-registration/steps/regulations/assessmentRegistrationRegulationStep.component';
import { FinalDeclarationComponent } from './final-declaration/finalDeclaration.component';
import { FinalDeclarationConfirmTrainingStepComponent } from './final-declaration/steps/training/finalDeclarationConfirmTrainingStep.component';
import { FinalDeclarationTraineePlacementComponent } from './final-declaration/steps/training/finalDeclarationTraineePlacement.component';
import { FinalDeclarationCountersigningStepComponent } from './final-declaration/steps/countersigning/finalDeclarationCountersigningStep.component';
import { FinalDeclarationTemporaryRegistrationStepComponent } from './final-declaration/steps/temporaryRegistration/finalDeclarationTemporaryRegistrationStep.component';
import { FinalDeclarationReviewComponent } from './final-declaration/steps/review/finalDeclarationReview.component';
import { FinalDeclarationReviewStepComponent } from './final-declaration/steps/review/finalDeclarationReviewStep.component';
import { FinalDeclarationSummaryComponent } from './final-declaration/steps/declaration/finalDeclarationSummaryStep.component';
import { FinalDeclarationFtpStepComponent } from './final-declaration/steps/declaration/finalDeclarationFtpStep.component';
import { FinalDeclarationOverallConfirmationStepComponent } from './final-declaration/steps/declaration/finalDeclarationOverallConfirmationStep.component';
import { FinalDeclarationSubmitStepComponent } from './final-declaration/steps/submit/finalDeclarationSubmitStep.component';
import { GuidanceComponent } from './steps/guidance/guidance.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    AccountModule,
    PreregRoutingModule,
    RenewalModule,
  ],
  declarations: [
    RegApplicationComponent,
    RegApplicationReviewComponent,
    PreregDashboardComponent,
    PreregComponent,
    PersonalDetailsStepComponent,
    EqualityDiversityStepComponent,
    FtpDeclarationStepComponent,
    OverallDeclarationStepComponent,
    ConfirmTrainingStepComponent,
    PaymentStepComponent,
    PaymentStepOldComponent,
    ReviewStepComponent,
    SubmitStepComponent,
    TraineeAssessmentComponent,
    TraineePlacementComponent,
    LetterStepComponent,
    DeclarationSummaryComponent,
    FirstYearPaymentComponent,
    FirstYearPaymentOldComponent,
    CountersigningStepComponent,
    PastApplicationComponent,
    LetterSummaryComponent,
    SupportingDocumentsStepComponent,
    GuidanceComponent,
    //AROS
    AssessmentReportComponent,
    //AssessmentReportPersonalDetailsStepComponent,
    AssessmentReportTraineePlacementComponent,
    AssessmentReportConfirmTrainingStepComponent,
    AssessmentReportCountersigningStepComponent,
    AssessmentReportSubmitStepComponent,
    AssessmentReportReviewComponent,
    AssessmentReportReviewStepComponent,
    AssessmentReportTemporaryRegistrationStepComponent,
    AssessmentReportDeclarationSummaryComponent,
    AssessmentReportFtpDeclarationStepComponent,
    AssessmentReportOverallDeclarationStepComponent,
    SittingConfirmationComponent,
    AssessmentRegistrationComponent,
    AssessmentRegistrationDeclarationComponent,
    AssessmentRegistrationReviewComponent,
    AssessmentRegistrationPaymentStepComponent,
    AssessmentRegistrationPaymentStepOldComponent,
    AssessmentRegistrationPersonalDetailsComponent,
    AssessmentRegistrationReviewStepComponent,
    AssessmentRegistrationSubmitComponent,
    AssessmentRegistrationSupportingDocumentsStepComponent,
    AssessmentRegistrationRegulationStepComponent,
    //final declaration
    FinalDeclarationComponent,
    FinalDeclarationConfirmTrainingStepComponent,
    FinalDeclarationTraineePlacementComponent,
    FinalDeclarationCountersigningStepComponent,
    FinalDeclarationReviewComponent,
    FinalDeclarationReviewStepComponent,
    FinalDeclarationTemporaryRegistrationStepComponent,
    FinalDeclarationSummaryComponent,
    FinalDeclarationFtpStepComponent,
    FinalDeclarationOverallConfirmationStepComponent,
    FinalDeclarationSubmitStepComponent
  ],
  exports: [
    PreregDashboardComponent,
    RegApplicationReviewComponent,
    AssessmentReportReviewComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PreregModule { }
