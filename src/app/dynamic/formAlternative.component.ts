import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormQuestion } from './model/FormQuestion';
import { FormAlternative } from './model/FormAlternative';
import { FormValidator } from './service/FormValidator';
import { Form } from './model/Form';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-form-alternative',
  moduleId: module.id,
  templateUrl: './formAlternative.component.html',
  styleUrls: ['formAlternative.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormAlternativeComponent implements OnInit {

  @Input() form: Form;
  @Input() question: FormQuestion;
  @Input() readonly = false;
  public alternativeSelections = new Subject<any>();
  selectedAlternativeText: string;

  get selectedAlternative(): FormAlternative {
    if (!this.question.answer) {
      return undefined;
    }
    return this.question.alternatives
      .filter(a => a.id === this.question.answer)[0];

  }

  // return true only for FTP VR application to display different additional information
  get formType(): boolean {
    return (this.form.formType == 17 ?  true:  false);

  }

  get isApplicationCCPS(): boolean {
    return (this.form?.formType === 20);
  }

  constructor(private service: FormValidator) {

    const subscription = this.alternativeSelections
      .pipe(debounceTime(250))
      .subscribe(this.onSelect.bind(this));

   }

   ngOnInit() {
     if (this.readonly) {
      const selectedAlternative = this.question.alternatives.find(a => a.id === this.question.answer);
      if (selectedAlternative) {
        this.selectedAlternativeText = selectedAlternative.text;
      }
     }
   }


  onSelect(selected: FormAlternative) {
    this.service.setAnswer(this.form.id, this.question.id, selected.id, selected.referenceNumber);
  }

  onReferenceNumberChange(el, selectedAlternative) { 
    this.service.setAnswer(this.form.id, this.question.id,selectedAlternative.id, el.target.value);
  }
}
