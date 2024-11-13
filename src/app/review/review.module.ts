import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicModule } from '../dynamic/dynamic.module';
import { SharedModule } from '../shared/shared.module';
import { AssessmentComponent } from './assessment.component';
import { ReviewSummaryComponent } from './reviewSummary.component';
import { ReviewComponent } from './review.component';
import { DiscussionComponent } from './discussion.component';
import { AnnotateComponent } from './annotate.component';
import { DiscussComponent } from './discuss.component';
import { FeedbackComponent } from './feedback.component';
import { FeedbackHelpComponent } from './feedbackHelp.component';
import { AssessmentHelpComponent } from './assessmentHelp.component';
import { RouterModule } from '@angular/router';
// import { HttpModule } from '@angular/http';
import { ReviewRoutingModule } from './review-routing.module';
import { FeedbackSectionsComponent } from './feedbackSections.component';
import { CustomErrorHandler } from '../core/service/CustomErrorHandler';
import { FeedbackApprovalDialogComponent } from './feedbackApprovalDialog.component';
import { ReviewHeaderComponent } from './reviewHeader.component';
import { FeedbackSectionsReadonlyComponent } from './feedbackSectionsReadonly.component';
import { ReviewSummaryListComponent } from './reviewSummaryList.component';
@NgModule({
    imports: [
        // HttpModule,
        FormsModule,
        CommonModule,
        DynamicModule,
        SharedModule,
        RouterModule,
        ReviewRoutingModule
    ],
    declarations: [
        ReviewSummaryComponent,
        ReviewSummaryListComponent,
        FeedbackSectionsComponent,
        FeedbackSectionsReadonlyComponent,
        FeedbackComponent,
        AnnotateComponent,
        DiscussComponent,
        AssessmentComponent,
        FeedbackHelpComponent,
        DiscussionComponent,
        FeedbackApprovalDialogComponent,
        AssessmentHelpComponent,
        ReviewComponent,
        ReviewHeaderComponent
    ],
    providers: [
        { provide: ErrorHandler, useClass: CustomErrorHandler }
    ]
})
export class ReviewModule { }
