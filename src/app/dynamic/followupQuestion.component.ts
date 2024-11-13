import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormQuestion } from './model/FormQuestion';
import { Form } from './model/Form';
import { AnswerType } from './model/AnswerType';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-followup-question',
  moduleId: module.id,
  templateUrl: './followupQuestion.component.html',
  styleUrls: ['./followupQuestion.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
  trigger('openState', [
    state('open', style({
      height: '*'      
    })),
    state('closed',   style({
      height: '0'      
    })),
    transition('open => closed', animate('300ms ease-in-out')),
    transition('closed => open', animate('300ms ease-in-out'))
  ])
]
})
export class FollowupQuestionComponent implements OnInit {
  @Input() question: FormQuestion;
  @Input() form: Form;
  @Input() readonly = false;
  @Input() visible;
  hasFocus;

  openState = 'closed';
  AnswerType = AnswerType;

  ngOnInit() {
    this.openState = 'open';
  }

  setFocus() {
    this.hasFocus = true;
    setTimeout(() => {
      this.hasFocus = false;
    });
  }


}
