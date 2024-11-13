import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormQuestion } from '../dynamic/model/FormQuestion';
import { Form } from '../dynamic/model/Form';
import { AnswerType } from '../dynamic/model/AnswerType';
import { Tooltip } from '../core/tooltip/Tooltip';

@Component({
  selector: 'app-revalidation-question',
  moduleId: module.id,
  templateUrl: './revalidationQuestion.component.html',
  styleUrls: ['./revalidationQuestion.scss']
})
export class RevalidationQuestionComponent {
  @Input() form: Form;
  @Input() question: FormQuestion;
  @Input() last: boolean;
  @Input() readonly: boolean;
  @Output() infoChanged = new EventEmitter<any>();
  hasFocus = '';
  helpTooltip: Tooltip = {
    id: 'help',
    content: 'Click for help on <br/>how to fill in this section',
    width: 230,
    placement: 'right',
    order: -1,
    isHidden: () => {
      return this.helpVisible;
    }
  };

  helpVisible = false;
  AnswerType = AnswerType;

  requiredFieldTooltip = {
    id: 'required',
    content: `This field is mandatory`,
    placement: 'top'
  };

  toggleHelp() {
    this.helpVisible = !this.helpVisible;
  }

  onInfoChanged(info) {
    this.infoChanged.emit(info);
  }

  setFocus() {
    this.hasFocus = Math.random.toString();
  }
}
