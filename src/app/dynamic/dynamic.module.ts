import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormAlternativeComponent } from './formAlternative.component';
import { FormQuestionComponent } from './formQuestion.component';
import { FollowupQuestionComponent } from './followupQuestion.component';
import { FormQuestionControlComponent } from './formQuestionControl.component';
import { SharedModule } from '../shared/shared.module';
import { CustomErrorHandler } from '../core/service/CustomErrorHandler';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  declarations: [
    FormAlternativeComponent,
    FormQuestionComponent,
    FollowupQuestionComponent,
    FormQuestionControlComponent
  ],
  exports: [
    FormAlternativeComponent,
    FormQuestionComponent,
    FollowupQuestionComponent,
    FormQuestionControlComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ]
})
export class DynamicModule { }
