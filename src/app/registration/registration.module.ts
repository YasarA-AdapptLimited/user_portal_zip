import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicModule } from '../dynamic/dynamic.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { AccountModule } from '../account/account.module';
import { RegistrantDashboardComponent } from './registrantDashboard.component';
import { CustomErrorHandler } from '../core/service/CustomErrorHandler';
import { RegistrationComponent } from './registration.component';
import { RegistrantBadgeComponent } from './registrantBadge.component';
import { CountersignComponent } from './countersign.component';
import { PreregModule } from '../prereg/prereg.module';
import { NoticeOfEntryComponent } from './letter/noticeOfEntry.component';
import { NoticeOfIntendedRemovalComponent } from './letter/noticeOfIntendedRemoval.component';
import { NorComponent } from './letter/nor.component';
import { NoticeOfRemediationComponent } from '../registration/letter/noticeOfRemediation.component';
import { LetterComponent } from './letter.component';
import { LetterFooterComponent } from './letter/letterFooter.component';
import { LetterHeaderComponent } from './letter/letterHeader.component';
import { LetterGuard } from '../guard/Letter.guard';
import { LearningContractResponseComponent } from './learningContractResponse.component';
import { TrainingRecordComponent } from './letter/trainingRecord.component';
import { RenewalLetterComponent } from './letter/renewalLetter.component';
import { RenewalCardLetterComponent } from './letter/renewalCardLetter.component';
import { RenewalDDLetterComponent } from './letter/renewalDDLetter.component';
import { TechnicianModule } from '../technician/technician.module';
import { AssessmentCountersignResponseComponent } from './assessment-report/assessmentCountersignResponse.component';
import { AssessmentApproveLetterComponent } from './letter/assessmentApproveLetter.component';
import { AssessmentAttemptPassLetterComponent } from './letter/assessment-results/assessmentAttemptPassLetter.component';
import { AssessmentThirdAttemptFailLetterComponent } from './letter/assessment-results/assessmentThirdAttemptFailLetter.component';
import { AssessmentFirstAndSecondAttemptFailLetterComponent } from './letter/assessment-results/assessmentFirstAndSecondAttemptFailLetter.component';
import { FinalDeclarationCountersignResponseComponent } from './final-declaration/finalDeclarationCountersignResponse.component';
import { IndependentPrescriberApplicationComponent } from './independent-precriber/independentPrescriberApplication.component';
import { EdiStepComponent } from './independent-precriber/steps/edi-step/edi-step.component';
import { DeclarationsStepComponent } from './independent-precriber/steps/declarations-step/declarations-step.component';
import { PaymentStepComponent } from './independent-precriber/steps/payment-step/payment-step.component';
import { PaymentStepOldComponent } from './independent-precriber/steps/payment-step/oldFlow/payment-step.component';
import { QualificationStepComponent } from './independent-precriber/steps/qualification-step/qualification-step.component';
import { CounterSignatureStepComponent } from './independent-precriber/steps/counter-signature-step/counter-signature-step.component';
import { IndependentPrescriberMentorCountersigninComponent } from './independent-prescriber-mentor/independentPrescriberMentorCountersignin.component';
import { IndependentPrescriberFinalReviewComponent } from './independent-precriber/steps/final-review-step/independentPrescriberApplicationFinalReview.component';
import { ApplicationsDashboardComponent } from './applicationsDashboard.component';
import { VoluntaryRemovalComponent } from './voluntary-removal/voluntary-removal.component';
import { VrEdiStepComponent } from './voluntary-removal/steps/vr-edi-step/vr-edi-step.component';
import { VrFtpDeclarationStepComponent } from './voluntary-removal/steps/vr-ftp-declaration-step/vr-ftp-declaration-step.component';
import { VrApplicationDeclarationsStepComponent } from './voluntary-removal/steps/vr-application-declarations-step/vr-application-declarations-step.component';
import { VrApplicationReviewStepComponent } from './voluntary-removal/steps/vr-application-review-step/vr-application-review-step.component';
import { VrPaymentStepComponent } from './voluntary-removal/steps/vr-payment-step/vr-payment-step.component';
import { VrPaymentStepOldComponent } from './voluntary-removal/steps/vr-payment-step/oldFlow/vr-payment-step.component';
import { VrDateReasonForRemovalRequiredStepComponent } from './voluntary-removal/steps/vr-date-reason-for-removal-required-step/vr-date-reason-for-removal-required-step.component';
import { VrDeclarationSummaryComponent } from './voluntary-removal/steps/vr-ftp-declaration-step/vr-declaration-summary.component';
import { VrApplicationReviewComponent } from './voluntary-removal/steps/vr-application-review-step/vr-application-review.component';
import { RenewalModule } from '../renewal/renewal.module';
import { VrConfirmationLetterComponent } from './letter/vrConfirmationLetter.component';
import { CcpsComponent } from './ccps/ccps.component';
import { OverseasRegularDetailsComponent } from './ccps/steps/overseas-regular-details/overseas-regular-details.component';
import { InitialPharmacyQualificationDetailsComponent } from './ccps/steps/initial-pharmacy-qualification-details/initial-pharmacy-qualification-details.component';
import { FtpDeclarationsComponent } from './ccps/steps/ftp-declarations/ftp-declarations.component';
import { CcpsDeclarationsComponent } from './ccps/steps/ccps-declarations/ccps-declarations.component';
import { PaymentComponent } from './ccps/steps/payment/payment.component';
import { PaymentOldComponent } from './ccps/steps/payment/oldFlow/payment.component';
import { CcpsReviewComponent } from './ccps/steps/ccps-review/ccps-review.component';
import { CCPSEDIComponent } from './ccps/steps/ccps-edi/ccps-edi.component';
import { CcpsApplicationReviewComponent} from './ccps/steps/ccps-review/ccpsApplicationReview.component';
import { CCPSPersonalDetailsComponent } from './ccps/steps/ccps-personal-details/ccps-personal-details.component';
import { ReturnToRegisterComponent } from './return-to-register/return-to-register-application.component';
import { PersonalDetailsComponent } from './return-to-register/steps/personal-details/personal-details.component';
import { LetterOfGoodStandingComponent } from './return-to-register/steps/letter-of-good-standing/letter-of-good-standing.component';
import { RegistrationDetailsComponent } from './return-to-register/steps/registration-details/registration-details.component';
import { RevalidationRecordOutstandingComponent } from './return-to-register/steps/revalidation-record-outstanding/revalidation-record-outstanding.component';
import { EqualityDiversityComponent } from './return-to-register/steps/equality-diversity/equality-diversity.component';
import { ApplicationDeclarationsComponent } from './return-to-register/steps/application-declarations/application-declarations.component';
import { FtpDeclarationOneComponent } from './return-to-register/steps/ftp-declarations/ftp-declarations-one.component';
import { FtpDeclarationTwoComponent } from './return-to-register/steps/ftp-declarations/ftp-declarations-two.component';
import { RtrReviewStepComponent } from './return-to-register/steps/review/rtrReviewStep.component';
import { RtrApplicationReviewComponent } from './return-to-register/steps/review/rtrApplicationReview.component';
import { DeclarationSummaryComponent } from './return-to-register/steps/ftp-declarations/declarationSummary.component';
import { RtrPaymentStepComponent } from './return-to-register/steps/payment/rtr-payment-step.component';
import { RtrPaymentStepOldComponent } from './return-to-register/steps/payment/oldFlow/rtr-payment-step.component';
import { RestorationFeePaymentComponent } from './restorationFeePayment.component';
import { RestorationFeePaymentOldComponent } from './restorationFeePaymentOldFlow/restorationFeePayment.component';
import { GuidanceComponent } from './return-to-register/steps/guidance/guidance.component';
import { CCPSDeclarationSummaryComponent } from './ccps/steps/ftp-declarations/declarationSummary.component';
import { TrainingDetailsComponent } from './ccps/steps/initial-pharmacy-qualification-details/training-details/training-details.component';
import { CcpsGuidanceComponent } from './ccps/steps/ccps-guidance/ccps-guidance.component';
import { RevalidationPartialSubmissionLetterComponent } from './letter/revalidationPartialSubmissionLetter.component';



@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DynamicModule,
    SharedModule,
    RouterModule,
    AccountModule,
    PreregModule,
    TechnicianModule,
    ReactiveFormsModule,
    RenewalModule
  ],
  declarations: [
    RegistrantDashboardComponent,
    RegistrationComponent,
    RegistrantBadgeComponent,
    CountersignComponent,
    NoticeOfEntryComponent,
    NoticeOfIntendedRemovalComponent,
    NorComponent,
    NoticeOfRemediationComponent,
    LetterComponent,
    LetterFooterComponent,
    LetterHeaderComponent,
    LearningContractResponseComponent,
    TrainingRecordComponent,
    RenewalLetterComponent,
    RevalidationPartialSubmissionLetterComponent,
    RenewalCardLetterComponent,
    RenewalDDLetterComponent,
    AssessmentCountersignResponseComponent,
    AssessmentApproveLetterComponent,
    AssessmentAttemptPassLetterComponent,
    AssessmentFirstAndSecondAttemptFailLetterComponent,
    AssessmentThirdAttemptFailLetterComponent,
    FinalDeclarationCountersignResponseComponent,
    /*Independent precriber*/
    IndependentPrescriberApplicationComponent,
    QualificationStepComponent,
    EdiStepComponent,
    DeclarationsStepComponent,
    PaymentStepComponent,
    PaymentStepOldComponent,
    CounterSignatureStepComponent,
    IndependentPrescriberMentorCountersigninComponent,
    IndependentPrescriberFinalReviewComponent,
    ApplicationsDashboardComponent,
    //VR application steps
    VoluntaryRemovalComponent,
    VrEdiStepComponent,
    VrFtpDeclarationStepComponent,
    VrApplicationDeclarationsStepComponent,
    VrApplicationReviewStepComponent,
    VrPaymentStepComponent,
    VrPaymentStepOldComponent,
    VrDateReasonForRemovalRequiredStepComponent,
    VrDeclarationSummaryComponent,
    VrApplicationReviewComponent,
    VrConfirmationLetterComponent,
    //CCPS application
    CcpsComponent,
    OverseasRegularDetailsComponent,
    InitialPharmacyQualificationDetailsComponent,
    FtpDeclarationsComponent,
    CcpsDeclarationsComponent,
    PaymentComponent,
    PaymentOldComponent,
    CcpsReviewComponent,
    CcpsApplicationReviewComponent,
    CCPSEDIComponent,
    CCPSDeclarationSummaryComponent,
    CCPSPersonalDetailsComponent,
    CcpsGuidanceComponent,
    //return to register
    ReturnToRegisterComponent,
    PersonalDetailsComponent,
    LetterOfGoodStandingComponent,
    RegistrationDetailsComponent,
    RevalidationRecordOutstandingComponent,
    EqualityDiversityComponent,
    ApplicationDeclarationsComponent,
    FtpDeclarationOneComponent,
    FtpDeclarationTwoComponent,
    RtrReviewStepComponent,
    RtrApplicationReviewComponent,
    DeclarationSummaryComponent,
    RtrPaymentStepComponent,
    RtrPaymentStepOldComponent,
    RestorationFeePaymentComponent,
    RestorationFeePaymentOldComponent,
    GuidanceComponent,
    TrainingDetailsComponent,

  ],
  exports: [
    RegistrantDashboardComponent,
    NoticeOfEntryComponent,
    NoticeOfIntendedRemovalComponent,
    NorComponent,
    NoticeOfRemediationComponent,
    RenewalLetterComponent,
    RevalidationPartialSubmissionLetterComponent,
    RenewalCardLetterComponent,
    RenewalDDLetterComponent,
    AssessmentCountersignResponseComponent,
    AssessmentApproveLetterComponent,
    AssessmentAttemptPassLetterComponent,
    AssessmentFirstAndSecondAttemptFailLetterComponent,
    AssessmentThirdAttemptFailLetterComponent,
    FinalDeclarationCountersignResponseComponent,
    ApplicationsDashboardComponent
  ],
  providers: [
    LetterGuard,
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegistrationModule { }
