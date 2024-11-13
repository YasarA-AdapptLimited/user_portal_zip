import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicModule } from '../dynamic/dynamic.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { AccountModule } from '../account/account.module';
import { PreregApplicationComponent } from './preregApplication.component';
import { StudentComponent } from './student.component';
import { CustomErrorHandler } from '../core/service/CustomErrorHandler';

import { StudentRoutingModule } from './student.routing.module';
// import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalDetailsStepComponent } from './steps/personalDetailsStep.component';
import { PlacementStepComponent } from './steps/placementStep.component';
import { PlacementComponent } from './placement.component';
import { SelectPremisesComponent } from './selectPremises.component';
import { SelectRegistrantComponent } from './selectRegistrant.component';
import { EqualityDiversityStepComponent } from './steps/equalityDiversityStep.component';
import { FtpDeclarationStepComponent } from './steps/declaration/ftpDeclarationStep.component';
import { OverallDeclarationStepComponent } from './steps/declaration/overallDeclarationStep.component';
import { RenewalModule } from '../renewal/renewal.module';
import { LearningContractStepComponent } from './steps/learningContractStep.component';
import { LearningContractComponent } from './learningContract.component';
import { DeclarationSummaryComponent } from './steps/declaration/declarationSummary.component';
import { PreregReviewStepComponent } from './steps/preregReviewStep.component';
import { PreregApplicationReviewComponent } from './steps/preregApplicationReview.component';
import { PaymentStepComponent } from './steps/paymentStep.component';
import { PaymentStepOldComponent } from './steps/oldFlow/paymentStep.component';
import { PastApplicationComponent } from './pastApplication.component';
import { SupportingDocumentsStepComponent } from './steps/supportingDocumentsStep.component';

@NgModule({
  imports: [
    CommonModule,
    // HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    AccountModule,
    StudentRoutingModule,
    RenewalModule
  ],
  declarations: [
    PreregApplicationComponent,
    PersonalDetailsStepComponent,
    PlacementStepComponent,
    StudentComponent,
    PlacementComponent,
    LearningContractComponent,
    SelectPremisesComponent,
    SelectRegistrantComponent,
    EqualityDiversityStepComponent,
    FtpDeclarationStepComponent,
    OverallDeclarationStepComponent,
    LearningContractStepComponent,
    DeclarationSummaryComponent,
    PreregReviewStepComponent,
    PreregApplicationReviewComponent,
    PaymentStepComponent,
    PaymentStepOldComponent,
    PastApplicationComponent,
    SupportingDocumentsStepComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ]
})
export class StudentModule { }
