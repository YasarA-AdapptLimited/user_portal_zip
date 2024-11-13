import { Injectable } from '@angular/core';
import { Form } from '../model/Form';
import { FormTemplate } from '../model/FormTemplate';
import { FormQuestion } from '../model/FormQuestion';
import { QuestionGroup } from '../model/QuestionGroup';
import { FormAlternative } from '../model/FormAlternative';
import { AnswerType } from '../model/AnswerType';
import { FormValidator } from './FormValidator';
import { FormAnswer } from '../model/FormAnswer';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FormValidationService extends FormValidator {

  forms: Array<Form> = [];
  state$ = new BehaviorSubject<Array<Form>>([]);

  public addForm(template: FormTemplate, formId?: string) {
    const form = new Form(template, formId);
    this.forms.push(form);
    return form;
  }


  public removeForm(formId) {
    const forms = this.forms.filter(form => form.id !== formId);
    this.forms = forms.splice(0);
  }

  public setForm(template: FormTemplate) {
    const form = new Form(template);
    this.forms = [form];
    this.updateState();
    return form;
  }

  public getForm(dynamicFormId: string) {
    return this.forms.find(form => form.dynamicFormId === dynamicFormId);
  }


  loadAnswers(form: Form, answers: Array<FormAnswer>) {
    answers.forEach(answer => {
      this.setAnswer(form.id, answer.questionId, answer.answer, answer.referenceNumber);
     
    });
    form.dirty = false;
    this.updateState();
  }

  updateState() {
    this.state$.next(this.forms);
  }

  protected findQuestion(form: Form, questionId: string): FormQuestion {
    return form.questionGroups.reduce((result: FormQuestion, group: QuestionGroup) => {
      if (result) { return result; }
      const filter = group.questions.filter(q => {
        return questionId === q.id;
      });
      if (filter.length) {
        result = filter[0];
      }
      return result;
    }, undefined);
  }

  protected findChild(form: Form, questionId: string): any {

    let result: any;
    form.questionGroups.forEach(group => {
      group.questions.forEach(q => {
        q.alternatives.forEach(a => {
          a.questions.forEach(aq => {
            if (aq.id === questionId) {
              result = { parent: q, question: aq };
              return;
            }
          });
        });
      });
    });
    return result;
  }

  protected updateParent(form: Form, question: FormQuestion, answer,referenceNumber: string) {
    this.updateQuestion(question, answer, referenceNumber);
    this.updateForm(form);
  }

  public hasError(form) {
    return form.questionGroups
      .filter(group => group.questions
        .filter(q => q.wrongAlternative).length)
      .length;
  }


  protected updateForm(form: Form) {
    form.progress = this.getProgress(form);
    form.invalid = this.hasInvalid(form);
    form.error = this.hasError(form);
    form.completed = this.getIsCompleted(form);
    form.dirty = true;
    let forms = [form];
    forms = forms.concat(this.forms.filter(f => f.id !== form.id));
    this.forms = forms;
    this.state$.next(forms);
  }

  protected pad(value) {
    value = '' + value;
    if (!value) {
      return '00';
    }
    if (value.length < 2) {
      return '0' + value;
    }
    return value;
  }


  protected updateQuestion(question: FormQuestion, answer: any, referenceNumber: string) {
    const previousAnswer = question.answer;

    if (question.type === AnswerType.Number) {

      if (answer !== undefined && answer !== null) {
        if (answer.trim() === '') {
          question.answer = '';
        } else {
          question.answer = parseInt(answer, 10).toString();
        }
      } else {
        question.answer = '';
      }
    } else {
      question.answer = answer;
    }

    if (question.type === AnswerType.Alternative) {
      question.alternativeSelected.next(question.alternatives.find(alternative => alternative.id === answer));
    }

    question.referenceNumber = referenceNumber ? referenceNumber : null;

    question.isValid = this.isValid(question);
    if (previousAnswer !== undefined) {
      question.alternatives.forEach(a => {
        if (a.id !== answer) {
          a.questions.forEach(q => {
            delete q.answer;
            delete q.isValid;
            q.errors = [];
          });
        }
      });
    }
  }

  protected updateChild(form: Form, parent: FormQuestion, question: FormQuestion, answer: any, referenceNumber: string) {
    this.updateQuestion(question, answer, referenceNumber);
    parent.isValid = this.isValid(parent);
    this.updateForm(form);
  }

  public setAnswer(formId: string, questionId: string, answer: any, referenceNumber: string) {
    const form: Form = this.forms.find(f => f.id === formId);
    const formToUpdate: Form = Object.assign({}, form);
    const questionToUpdate: FormQuestion = this.findQuestion(formToUpdate, questionId);
    if (questionToUpdate) {
      this.updateParent(formToUpdate, questionToUpdate, answer, referenceNumber);
    } else {
      const child = this.findChild(formToUpdate, questionId);
      if(child) {
        this.updateChild(formToUpdate, child.parent, child.question, answer, referenceNumber);
      }      
    }
  }

  protected getIsCompleted(form): boolean {
    return form.progress === form.total;
  }

  protected getProgress(form): number {
    return form.questionGroups.reduce((acc, item: QuestionGroup) => {
      acc += item.questions.filter(q => q.isValid).length;
      return acc;
    }, 0);
  }

  protected hasInvalid(form): boolean {
    return form.questionGroups.reduce((acc, item: QuestionGroup) => {
      acc += item.questions.filter(q => q.isValid === false).length;
      return acc;
    }, 0) > 0;
  }

  protected isValid(question: FormQuestion): boolean {

    question.errors = [];
    if (question.answer && question.type === AnswerType.Email) {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
      return regex.test(question.answer);
    }

    if (question.type === AnswerType.Number) {
      if (question.answer === '' || isNaN(+question.answer)) {
        question.errors.push('You must answer this question');
        return false;
      }
      if (question.max !== undefined && +question.answer > question.max) {
        question.errors.push('You must enter a number less than ' + question.max);
        return false;
      }
      if (question.min !== undefined && +question.answer < question.min) {
        question.errors.push('You must enter a number greater than ' + question.min);
        return false;
      }
      return true;
    }

    if(question && question.type === AnswerType.Date && question.shortName === 'extend_until') {                  
      if(!question.answer) {
        question.errors.push('Please select a date');
        return false;
      }
      if(question.answer && (new Date(question.answer).setHours(0,0,0,0) < new Date(question.min).setHours(0,0,0,0))) {
          question.errors.push('Please select a future date');
          return false;
        }      
    }

    if (!question.isRequired) {
      return true;
    }

    // TODO: avoid mutating question here
    question.wrongAlternative = this.wrongAlternative(question);
    question.hasWrongAlternative = this.hasWrongAlternative(question);

    if (question.answer === undefined || question.answer === null ||
      question.answer === '' || question.answer.trim && question.answer.trim() === '') {
      question.errors.push('This is mandatory');
      return false;
    }

    if (question.type !== AnswerType.Alternative) { return true; }

    if (question.wrongAlternative || question.hasWrongAlternative) {
      return false;
    }

    let isValid = true;
    const selectedAlternative: FormAlternative = question.alternatives
      .filter(a => a.id === question.answer)[0];
    if (selectedAlternative && selectedAlternative.questions && selectedAlternative.questions.length) {
      selectedAlternative.questions.forEach(q => {
        if (!q.isValid && !(!q.isRequired && !q.answer)) {
          isValid = false;
        }
      });
    }
    if (selectedAlternative && selectedAlternative.showAdditionalInfo) {
      if(!question.referenceNumber) isValid = false; else isValid = true;
    }
    return isValid;
  }

  public wrongAlternative(question: FormQuestion) {
    if (question.type !== AnswerType.Alternative) { return false; }
    if (!question.answer) {
      return false;
    }
    return (question.requiredAlternative && question.answer !== question.requiredAlternative.id);
  }

  public hasWrongAlternative(question: FormQuestion) {
    if (question.type !== AnswerType.Alternative) { return false; }
    if (!question.answer) {
      return false;
    }
    let hasWrong = false;
    const selectedAlternative: FormAlternative = question.alternatives
      .filter(a => a.id === question.answer)[0];
    if (selectedAlternative && selectedAlternative.questions && selectedAlternative.questions.length) {
      selectedAlternative.questions.forEach(q => {
        if (q.wrongAlternative) {
          hasWrong = true;
        }
      });
    }
    return hasWrong;
  }

  public hasAnsweredYes(question: FormQuestion) {
    const selectedAlternative = this.getSelectedAlternative(question);
    if (!selectedAlternative) { return false; }
    if (selectedAlternative.name === 'Y') {
      return true;
    }
    return false;
  }


  public hasToDeclare(question: FormQuestion) {

    let hasToDeclare = false;
    const selectedAlternative = this.getSelectedAlternative(question);
    if (!selectedAlternative) { return false; }
    if (selectedAlternative.showAdditionalInfo) {
      hasToDeclare = true;
    }

    selectedAlternative.questions.forEach(q => {

      const selectedAlternative2 = this.getSelectedAlternative(q);
      if (!selectedAlternative2) { hasToDeclare = false; return; }
      if (selectedAlternative2.showAdditionalInfo) {
        hasToDeclare = true;
        return;
      }

      selectedAlternative2.questions.forEach(q2 => {
        const selectedAlternative3 = this.getSelectedAlternative(q2);
        if (!selectedAlternative3) { hasToDeclare = false; return; }
        if (selectedAlternative3.showAdditionalInfo) {
          hasToDeclare = true;
          return;
        }
      });
    });

    return hasToDeclare;

  }

  private getSelectedAlternative(question: FormQuestion): FormAlternative {
    if (question.type !== AnswerType.Alternative) { return undefined; }
    if (!question.answer) {
      return undefined;
    }
    return question.alternatives
      .find(a => a.id === question.answer);
  }

public getQuestionByShortname(form: Form, shortName): FormQuestion {
  let out;
  form.questionGroups.forEach(group => {
    const q = group.questions.find(question => question.shortName === shortName);
    if (q) {
      out = q;
      return;
    } else {
      group.questions.forEach(question => {
        if (question.type === AnswerType.Alternative) {
          question.alternatives.forEach(alternative => {
            const qa = alternative.questions.find(ques => ques.shortName === shortName);
            if (qa) {
              out = qa;
              return;
            }
          });
        }
      });
    }
  });
  return out;
}

  public getAnswers(form) {
    return {
      internalId: form.id,
      dynamicFormId: form.dynamicFormId,
      answers: form.questionGroups.reduce((accGroupAnswers, group) => {
        const answers = group.questions.reduce((accQuestionAnswers, question) => {
          if (question.answer) {
            const selectedAlternative = question.alternatives.filter(a => a.id === question.answer)[0];
            accQuestionAnswers.push({ questionId: question.id, shortName: question.shortName, answer: selectedAlternative.id, referenceNumber: question.referenceNumber });
            if (selectedAlternative.questions && selectedAlternative.questions.length) {
              const followUpAnswers = selectedAlternative.questions.reduce((accFollowUpAnswers, followup) => {
                if (followup.answer) {
                  if (followup.type === AnswerType.Alternative) {
                    const selectedFollowup = followup.alternatives.filter(a => a.id === followup.answer)[0];
                    accFollowUpAnswers.push({ questionId: followup.id, shortName: followup.shortName, answer: selectedFollowup.id, referenceNumber: (followup?.referenceNumber || null) });
                  } else {
                    accFollowUpAnswers.push({ questionId: followup.id, shortName: followup.shortName, answer: followup.answer, referenceNumber: (followup?.referenceNumber || null) });
                  }
                }
                return accFollowUpAnswers;
              }, []);
              accQuestionAnswers = accQuestionAnswers.concat(followUpAnswers);
            }
          }
          return accQuestionAnswers;
        }, []);
        accGroupAnswers = accGroupAnswers.concat(answers);
        return accGroupAnswers;
      }, [])
    };
  }

  public getPayload(): Array<{ dynamicFormId: string, answers: Array<FormAnswer> }> {
    return this.forms.map(form => {
      return this.getAnswers(form);
    });
  }
}
