import { QuestionGroup } from './QuestionGroup';
import { IProgress } from '../../shared/IProgress';
import { FormTemplate } from './FormTemplate';
import { FormQuestion } from './FormQuestion';
import { AnswerType } from './AnswerType';
import { FormType } from './FormType';
import utils from '../../shared/service/utils';

export class Form implements IProgress {

  type: FormType;
  dynamicFormId: string;
  formType: FormType;
  id: string;
  formTitle: string;
  formBody: string;
  questionGroups: QuestionGroup[];

  progress: number;
  completed: boolean;
  total: number;
  invalid = false;
  error = false;
  dirty = false;

  constructor(template: FormTemplate, id?: string) {

    this.dynamicFormId = template.dynamicFormId;
    this.formTitle = template.formTitle;
    this.formBody = template.formBody;
    this.formType =template.type;
    this.id = id || utils.guid();
    this.questionGroups = template.questionGroups.map(group => {
      const questions = group.questions.map(question => new FormQuestion(question));
      return Object.assign({}, group, { questions });
    });

    this.total = this.questionGroups.reduce((acc, item: QuestionGroup) => {
      acc += item.questions.length;
      return acc;
    }, 0);
    this.progress = 0;
    this.completed = false;
  }
}
