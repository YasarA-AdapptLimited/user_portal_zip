import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding, OnInit } from '@angular/core';
import { AnswerType } from './model/AnswerType';
import { FormQuestion } from './model/FormQuestion';
import { Form } from './model/Form';
import { FormValidator } from './service/FormValidator';
import { LayoutService } from '../core/service/layout.service';
@Component({
  selector: 'app-form-question-control',
  moduleId: module.id,
  templateUrl: './formQuestionControl.component.html',
  styleUrls: ['./formQuestionControl.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormQuestionControlComponent {
  @Input() form: Form;
  @Input() question: FormQuestion;
  @Input() title: string;
  @Input() readonly = false;
  hasFocus = false;
  @Input('hasFocus') set setHasFocus(focus) {
    this.hasFocus = focus;
  }
  @Output() infoChanged = new EventEmitter<any>();

  @Input('visible') set setVisible(visible) {

    if (visible) {
      if ((this.question && this.question.defaultAnswer) && !this.question.answer) {
        this.validator.setAnswer(this.form.id, this.question.id, this.question.defaultAnswer, this.question.referenceNumber);
      }
    }

  }

  type = AnswerType;
  datePickerVisible = false;

  constructor(private validator: FormValidator, public layout: LayoutService) { }



  update(answer?) {
    this.validator.setAnswer(this.form.id, this.question.id, answer, this.question.referenceNumber);
  }

  toggleDatePicker() {
    this.datePickerVisible = !this.datePickerVisible;
  }


  onInfoChanged(info) {
    this.infoChanged.emit(info);
  }

}
