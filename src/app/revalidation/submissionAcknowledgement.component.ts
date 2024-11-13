import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-submission-acknowledgement',
  templateUrl: 'submissionAcknowledgement.html',
  styleUrls: ['./revalidation.scss']
})
export class SubmissionAcknowledgementComponent {

  @Output() acknowledged = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() submitting;
  @Input() renewalDate;
  @Input() remediation = false;

  showFromDate = new Date('2019-11-1');

  confirmRevalidationQuestions = {
    question1: undefined,
    question2: undefined,
    question3: undefined,
  };

  remediationConfirmationQuestions = {
    question1: undefined,
    question2: undefined,
    question3: undefined
  };


  get allQuestionsRequired() {
    if (this.renewalDate) {
      const date = this.renewalDate.split('T')[0];
      return new Date(date) >= this.showFromDate;
    } else {
      return false;
    }

  }


  get valid() {
    if (this.allQuestionsRequired) {
      return this.confirmRevalidationQuestions.question1 === true &&
        this.confirmRevalidationQuestions.question2 === true &&
        this.confirmRevalidationQuestions.question3 === true;
    } else {
      return this.confirmRevalidationQuestions.question1 === true &&
        this.confirmRevalidationQuestions.question3 === true;
    }
  }

  get isRemediationFormValid () {
    if (this.allQuestionsRequired) {
      return this.remediationConfirmationQuestions.question1 === true &&
        this.remediationConfirmationQuestions.question2 === true &&
        this.remediationConfirmationQuestions.question3 === true;
    } else {
      return this.remediationConfirmationQuestions.question1 === true &&
        this.remediationConfirmationQuestions.question3 === true;
    }
  }
}
