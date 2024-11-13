import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormQuestion } from '../dynamic/model/FormQuestion';
import { Form } from '../dynamic/model/Form';

@Component({
  selector: 'app-declaration-question',
  moduleId: module.id,
  templateUrl: './declarationQuestion.component.html',
  styleUrls: ['./declarationQuestion.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeclarationQuestionComponent {
  @Input() question: FormQuestion;
  @Input() form: Form;
  @Input() readonly = false;
  @Input() formId;
}
