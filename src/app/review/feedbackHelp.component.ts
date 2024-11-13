import { Component, Input, OnInit } from '@angular/core';
import { RevalidationItemType } from '../shared/model/revalidation/RevalidationItemType';

@Component({
  selector: 'app-feedback-help',
  moduleId: module.id,
  templateUrl: './feedbackHelp.component.html',
  styleUrls: ['./feedbackHelp.scss']
})
export class FeedbackHelpComponent {

  @Input() type: RevalidationItemType;
  RevalidationItemType = RevalidationItemType;
}
