import { FormAnswer } from '../../../dynamic/model/FormAnswer';
import { IProgress } from '../../../shared/IProgress';
import { RevalidationItemType } from './RevalidationItemType';

export class RevalidationItem implements IProgress {
  id = '';
  title = '';
  type: RevalidationItemType;
  dynamicFormId: string;

  total = 0;
  progress = 0;
  completed = false;
  invalid = false;

  isCompleted = false;

  included = true;
  deleted = false;
  submitted = false;
  submittedDate: string;
  answers: FormAnswer[] = [];

  readonly = false;

  constructor(type: RevalidationItemType) {
    this.type = type;
  }

}




