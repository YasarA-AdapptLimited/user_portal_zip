import { Input, Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Applicant } from '../../account/model/Applicant';
import { RegApplicationStep } from '../model/RegApplicationStep';
import { RegApplication } from '../model/RegApplication';


@Component({
  selector: 'app-reg-application-review',
  templateUrl: './regApplicationReview.component.html',
  styleUrls: ['./regApplicationReview.scss']
}) export class RegApplicationReviewComponent  implements OnInit {

  applicant: Applicant;
  @Input() application: RegApplication;
  @Input() readonly = false;
  @Input() formId;
  @Input() showEdi = true;
  @Input() showContactDetails = true;
  RegApplicationStep = RegApplicationStep;

  @Output() navigate = new EventEmitter<number>();
  ngOnInit() {
    this.applicant = this.application.trainee;
  }
  goToStep(stepId) {
    this.navigate.emit(stepId);
  }
}
