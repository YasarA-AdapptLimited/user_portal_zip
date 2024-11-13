import { RevalidationItemType } from '../revalidation/RevalidationItemType';
import { CpdForm } from './CpdForm';

export interface CpdEntry {
  id: string;
  title: string;
  type: RevalidationItemType;
  otherReviewerAnnotation: string;
  currentReviewerAnnotation: string;
  form: CpdForm;
  isOpen: boolean;
  assessment?: boolean;
}
