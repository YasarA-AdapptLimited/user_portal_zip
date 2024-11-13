import { Component, Input, OnInit } from '@angular/core';
import { RegApplication } from '../../model/RegApplication';
import { TraineeAssessment } from '../../model/TraineeAssessment';

@Component({
  selector: 'app-trainee-assessment',
  templateUrl: './traineeAssessment.component.html'
})
export class TraineeAssessmentComponent implements OnInit {

  @Input() application: RegApplication;

  ngOnInit() {
    if (this.application.assessment.assessments) {
      this.application.assessment.assessments.sort((a, b) => {
           return parseInt(a.session, 10) - parseInt(b.session, 10);
       });
    }
  }

}
