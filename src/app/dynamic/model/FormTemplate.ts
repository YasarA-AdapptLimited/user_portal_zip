import { FormType } from './FormType';
import { QuestionGroup } from './QuestionGroup';

export interface FormTemplate {
  dynamicFormId: string;
  formTitle: string;
  formBody: string;
  type:FormType;
  questionGroups: QuestionGroup[];
}
