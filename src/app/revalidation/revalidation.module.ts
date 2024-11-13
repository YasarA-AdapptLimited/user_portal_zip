import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicModule } from '../dynamic/dynamic.module';
import { SharedModule } from '../shared/shared.module';
import { RevalidationComponent } from './revalidation.component';
import { RevalidationItemComponent } from './revalidationItem.component';
import { RevalidationReadonlyComponent } from './revalidationReadonly.component';
import { RevalidationQuestionComponent } from './revalidationQuestion.component';
import { PastSubmissionComponent } from './pastSubmission.component';
import { IncludedItemsComponent } from './includedItems.component';
import { ExcludedItemsComponent } from './excludedItems.component';
import { RouterModule } from '@angular/router';
// import { HttpModule } from '@angular/http';
import { RevalidationRoutingModule } from './revalidation-routing.module';
import { ExtenuatingCircumstancesComponent } from './extenuatingCircumstances.component';
import { ExtenuatingCircumstancesFaqComponent } from './extenuatingCircumstancesFaq.component';
import { CustomErrorHandler } from '../core/service/CustomErrorHandler';
import { SubmissionPipe } from '../shared/pipe/Submission.pipe';
import { TooltipModule } from '../core/tooltip/tooltip.module';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { SubmittedExtenuatingCircumstancesComponent } from './submittedExtenuatingCircumstances.component';
import { SubmissionAcknowledgementComponent } from './submissionAcknowledgement.component';
import { SubmittedExtCircAdviceComponent } from './submittedExtCircAdviceComponent.component';
import { ExtenuatingCircumstancesHelpComponent } from './extenuatingCircumstancesHelp.component';
import { CoreModule } from '../core/core.module';
import { PastSubmission2Component } from './pastSubmission2.component';
import { RevalidationSubmission } from './service/revalidationSubmission.service';

@NgModule({
  imports: [
    // HttpModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DynamicModule,
    SharedModule,
    RouterModule,
    RevalidationRoutingModule,
    TooltipModule
  ],
  declarations: [
    RevalidationComponent,
    RevalidationItemComponent,
    RevalidationReadonlyComponent,
    RevalidationQuestionComponent,
    IncludedItemsComponent,
    ExcludedItemsComponent,
    ExtenuatingCircumstancesComponent,
    ExtenuatingCircumstancesFaqComponent,
    SubmittedExtenuatingCircumstancesComponent,
    PastSubmissionComponent,
    PastSubmission2Component,
    SubmissionAcknowledgementComponent,
    SubmittedExtCircAdviceComponent,
    ExtenuatingCircumstancesHelpComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
     { provide: RevalidationSubmission},    
    SubmissionPipe
  ]
})
export class RevalidationModule { }
