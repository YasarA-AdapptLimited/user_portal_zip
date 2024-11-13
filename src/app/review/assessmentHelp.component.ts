import { Component, Input, OnInit } from '@angular/core';
import { Review } from './model/Review';
import { ReviewStage } from './model/ReviewStage';
import { FeedbackConfirmation } from './model/FeedbackConfirmation';
import { PerformanceIndicator } from './model/PerformanceIndicator';
import { revalidationItemTypes } from '../shared/model/revalidation/revalidationItemTypes';

@Component({
  selector: 'app-assessment-help',
  moduleId: module.id,
  templateUrl: './assessmentHelp.component.html',
  styleUrls: ['./feedbackHelp.scss']
})
export class AssessmentHelpComponent {

}
