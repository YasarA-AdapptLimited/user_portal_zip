import { Component, forwardRef, AfterViewInit, OnInit, ViewChild, Input } from '@angular/core';


import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';
import { PreviousRegistrationType } from '../../model/PreviousRegistrationType';
import { UtcDatePickerComponent } from '../../../shared/utcDatePicker.component';
import { TechnicianApplication } from '../../model/TechnicianApplication';

@Component({
  selector: 'app-previous-applications-and-registrations-summary',
  templateUrl: './previousApplicationsAndRegistrationsSummary.component.html',
  styleUrls: ['./previousApplicationsAndRegistrationsSummary.component.scss']
})
export class PreviousApplicationsAndRegistrationsSummaryComponent implements OnInit {
  stepId = TechnicianApplicationStep.PreviousApplicationsAndRegistrations;
  title = 'Previous registrations';
  viewReady = false;
  @Input() application: TechnicianApplication;
  PreviousRegistrationType = PreviousRegistrationType;
  // @ViewChild('firstDatePicker') firstDatePicker: UtcDatePickerComponent;
  // @ViewChild('secondDatePicker') secondDatePicker: UtcDatePickerComponent;

  hasReducedWorkExperience: boolean;
  outsideTheUkWithReducedExperience = false;

  constructor() {}

  ngOnInit() { }


}

