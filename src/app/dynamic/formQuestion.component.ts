import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormQuestion } from './model/FormQuestion';
import { Form } from './model/Form';
import { AnswerType } from './model/AnswerType';
import { Tooltip } from '../core/tooltip/Tooltip';

@Component({
  selector: 'app-form-question',
  moduleId: module.id,
  templateUrl: './formQuestion.component.html',
  styleUrls: ['./formQuestion.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormQuestionComponent {
  @Input() question: FormQuestion;
  @Input() form: Form;
  @Input() readonly = false;
  @Output() infoChanged = new EventEmitter<any>();

  helpTooltip: Tooltip = {
    id: 'help',
    content: 'Click for more information about this question.',
    width: 290,
    placement: 'right',
    order: -1
  };

  helpVisible = false;
  AnswerType = AnswerType;

  toggleHelp() {
    this.helpVisible = !this.helpVisible;
  }

  onInfoChanged(info) {
    this.infoChanged.emit(info);
  }

}
