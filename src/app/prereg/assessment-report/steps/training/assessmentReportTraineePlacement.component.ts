import { AssessmentTutorDetails } from './../../models/AssessmentTutors';
import { Component, Input, OnInit } from '@angular/core';
import { Address } from '../../../../account/model/Address';
import { TrainingPlacement } from '../../../model/TrainingPlacement';

@Component({
  selector: 'app-assessment-report-trainee-placement',
  templateUrl: './assessmentReportTraineePlacement.component.html'
})
export class AssessmentReportTraineePlacementComponent implements OnInit {
  @Input() trainingSites: TrainingPlacement[];
  @Input() tutors: AssessmentTutorDetails[];
  itemAddresses: string[];

  ngOnInit() {
    this.itemAddresses = this.trainingSites.map((training: TrainingPlacement) => {
      return new Address(training.address).toString('<br/>');
    });
  }
}
