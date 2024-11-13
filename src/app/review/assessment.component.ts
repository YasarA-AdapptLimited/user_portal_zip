import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Review } from './model/Review';
import { ReviewStage } from './model/ReviewStage';
import { FeedbackConfirmation } from './model/FeedbackConfirmation';
import { PerformanceIndicator } from './model/PerformanceIndicator';
import { revalidationItemTypes } from '../shared/model/revalidation/revalidationItemTypes';

@Component({
  selector: 'app-assessment',
  moduleId: module.id,
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.scss']
})
export class AssessmentComponent implements OnInit, AfterViewInit {

  @Input() review: Review;
  @Input() readonly = false;
  ReviewStage = ReviewStage;
  FeedbackConfirmation = FeedbackConfirmation;
  PerformanceIndicator = PerformanceIndicator;
  performanceIndicators;
  helpVisible = false;
  title: string;
  text: string;
  coreCriteriaFeedbackRequired = false;
  showNoAssessmentMessage = false;

  constructor() { }

  getPerformanceIndicators() {
    const keys = [];
    for (const enumMember in PerformanceIndicator) {
      if (!isNaN(parseInt(enumMember, 10))) {
        if (PerformanceIndicator[enumMember] !== 'Unknown') {
          keys.push({key: enumMember,
            value: PerformanceIndicator[enumMember],
            displayName: PerformanceIndicator[enumMember].split(/(?=[A-Z])/).join(' ')});
        }
      }
    }
    return keys.reverse();
  }

  ngOnInit() {

    this.performanceIndicators = this.getPerformanceIndicators();


    this.title = this.review.stage === ReviewStage.Annotate ?
      'Initial assessment' : 'Final assessment';
    this.text =  this.review.stage === ReviewStage.Annotate ?
      'Click in the approriate box to set your initial assessment' :
      'Click in the approriate box to set your final assessment';

  }

  ngAfterViewInit() {

    if (this.review.isFeedbackEditable === false && this.readonly === undefined) {
      this.readonly = true;
    }
  }

  toggleHelp() {
    this.helpVisible = !this.helpVisible;
  }

  setAssessment(key) {
    if (!this.readonly) {

      if (this.review.stage === ReviewStage.Annotate) {
        this.review.currentReviewerAssessment = key;
      } else if (this.review.isFeedbackEditable) {
        this.review.feedback.performanceIndicator = key;
      }
      this.showNoAssessmentMessage = false;
    }
   
  }

}
