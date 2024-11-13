import { Component, Input, OnInit } from '@angular/core';
import { RegApplication } from '../../model/RegApplication';
import { TraineeReportType } from '../../model/TraineeReportType';
import { Address } from '../../../account/model/Address';
import { TrainingPlacement } from '../../model/TrainingPlacement';

@Component({
  selector: 'app-trainee-placement',
  templateUrl: './traineePlacement.component.html'
})
export class TraineePlacementComponent implements OnInit{
  itemAddresses: string[];
  TraineeReportType = TraineeReportType;
  @Input() application: RegApplication;

  ngOnInit() {
    this.itemAddresses = this.application.training.trainedAt.map((training: TrainingPlacement) => {
      return new Address(training.address).toString('<br/>');
    });
  }

}
