import { Component, Input } from '@angular/core';
import { CpdEntry } from '../model/review/CpdEntry';
import { AnswerType } from '../../dynamic/model/AnswerType';
@Component({
  selector: 'app-cpd-entry-answers',
  moduleId: module.id,
  templateUrl: './cpdEntryAnswers.component.html'
})
export class CpdEntryAnswersComponent {

  @Input() cpdEntry: CpdEntry;
  AnswerType = AnswerType;

}
