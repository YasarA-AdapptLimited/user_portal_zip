import { Component, Input, OnInit } from '@angular/core';
import { AssessmentTutorDetails } from '../../../../prereg/assessment-report/models/AssessmentTutors';
import { Address } from '../../../../account/model/Address';
import { TrainingPlacement } from '../../../model/TrainingPlacement';

@Component({
  selector: 'app-final-declaration-trainee-placement',
  templateUrl: './finalDeclarationTraineePlacement.component.html'
})
export class FinalDeclarationTraineePlacementComponent implements OnInit {
  @Input() trainingSites: TrainingPlacement[];
  @Input() tutors: AssessmentTutorDetails[];
  itemAddresses: string[];

  ngOnInit() {
    this.itemAddresses = this.trainingSites.map((training: TrainingPlacement) => {
      return new Address(training.address).toString('<br/>');
    });
  }
}
