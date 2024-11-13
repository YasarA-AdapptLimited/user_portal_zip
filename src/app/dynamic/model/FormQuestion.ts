import { AnswerType } from './AnswerType';
import { FormAlternative } from './FormAlternative';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';


interface TimeAnswer {
  hour: number;
  minute: number;
  second: number;
}
export class FormQuestion {
  id: string;
  shortName: string;
  title: string;
  body: null;
  tooltip: string;
  type: AnswerType;
  min: number | Date;
  max: number | Date;
  isRequired: boolean;
  isHidden: boolean;
  answer: string;
  defaultAnswer: string;
  time: TimeAnswer;
  alternatives: FormAlternative[] = [];
  requiredAlternative: FormAlternative;
  isValid: boolean;
  wrongAlternative: boolean;
  hasWrongAlternative: boolean;
  errors: Array<string> = [];
  alternativeSelected = new Subject<FormAlternative>();
  referenceNumber: string;

  constructor(formQuestion) {
    Object.assign(this, Object.assign({}, formQuestion));

    this.alternatives.forEach(a => {
      a.questions = a.questions.map(q => new FormQuestion(q));
    });

    this.requiredAlternative = this.alternatives.find(a => a.isRequired);

  }



}
