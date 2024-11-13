import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VoluntaryRemovalApplicationStep } from '../../model/VoluntaryRemovalApplicationStep';

@Component({
  selector: 'app-vr-application-review',
  templateUrl: './vr-application-review.component.html',
  styleUrls: ['./vr-application-review.component.scss']
})
export class VrApplicationReviewComponent implements OnInit {
    @Input() stepTitle;
    @Input() application;
    @Input() readonly = false;
    @Input() formId;
    @Input() SIdetails: {
      endDate: string;
      ownerName: string;
      ownerNumber: string;
      startDate: string;
    }

    @Output() navigate = new EventEmitter<number>();

    voluntaryRemovalDetails;
    VoluntaryRemovalApplicationStep = VoluntaryRemovalApplicationStep;    
    
    ngOnInit(): void {
      // this.stepTitle = this.SIdetails ? 'Date removal required, Superintendent (SI) & Reason for removal': 
      // 'Date removal required & Reason for removal';
      this.stepTitle = this.stepTitle ? this.stepTitle :'Removal details';
      if(this.application && this.application.activeForm && this.application.activeForm.voluntaryRemovalDetails) {
        this.voluntaryRemovalDetails = this.application.activeForm.voluntaryRemovalDetails;
      }
    }

    constructor() {}

    goToStep(stepId) {
        this.navigate.emit(stepId);
    }

}
