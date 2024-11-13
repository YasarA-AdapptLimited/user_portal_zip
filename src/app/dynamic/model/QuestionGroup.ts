
import { FormQuestion } from './FormQuestion';

export interface QuestionGroup {
  title: string;
  body: string;
  questions: FormQuestion[];
}
