import { Injectable, Inject } from '@angular/core';
import { FormValidationService } from '../../dynamic/service/formValidationService';
import { FormQuestion } from '../../dynamic/model/FormQuestion';
import { QuestionGroup } from '../../dynamic/model/QuestionGroup';
import { Form } from '../../dynamic/model/Form';
import { FormTemplate } from '../../dynamic/model/FormTemplate';
import { FormAnswer } from '../../dynamic/model/FormAnswer';
import { AnswerType } from '../../dynamic/model/AnswerType';
import { RevalidationItem } from '../../shared/model/revalidation/RevalidationItem';
import { RevalidationService } from '../../core/service/revalidation.service';
@Injectable()
export class RevalidationItemValidator
  extends FormValidationService {

  item: RevalidationItem;
  untitled = false;
  saving = false;

  constructor(@Inject(RevalidationService) private service: RevalidationService) {
    super();
  }

  setNew(type) {
    this.item = new RevalidationItem(type);
  }

  load(item) {
    this.item = item;
    const form = Object.assign({}, this.forms[0]);
    form.completed = item.isCompleted;
    form.questionGroups.forEach(questionGroup => {
      questionGroup.questions.forEach((question: FormQuestion) => {
        const formAnswer = item.answers
          .filter(a => a.questionId === question.id);
        if (formAnswer.length) {
          question.answer = formAnswer[0].answer;
          question.isValid = this.isValid(question);
        }
      });
    });
    this.updateForm(form);
    form.dirty = false;
  }

  getIsCompleted(form): boolean {
    return form.completed;
  }

  toggleCompleted() {
    const form = Object.assign({}, this.forms[0]);
    if (form.progress) {
      form.completed = !form.completed;
    }
    this.forms = [ form ];
  }

  validate() {
    this.untitled = !this.item.title;
    const form = Object.assign({}, this.forms[0]);
    this.forms = [ form ];
    return !this.untitled;
  }

  getProgress(form): number {
    return form.questionGroups.reduce((acc, item: QuestionGroup) => {
      acc += item.questions.filter(q => q.isValid && q.answer).length;
      return acc;
    }, 0);
  }

  getPayload(): any {
    const form = this.forms[0];
    const answers: FormAnswer[] = form.questionGroups
      .reduce((acc, questionGroup) => {
        acc = acc.concat(
          questionGroup.questions
            .filter(q => {
              return (q.answer !== null &&
                q.answer !== undefined &&
                q.answer.trim() !== '');
            })
            .map(q => {
              return {
                answer: q.answer, // || q.answer,
                questionId: q.id
              };
            })
        );
        return acc;
      }, []);

    return {
      id: this.item.id,
      dynamicFormId: form.dynamicFormId,
      included: this.item.included,
      title: this.item.title,
      answers,
      isCompleted: form.completed
    };
  }
}
