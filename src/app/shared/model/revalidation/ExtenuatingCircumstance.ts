import { FormAnswer } from '../../../dynamic/model/FormAnswer';
import { FileUpload } from '../../model/FileUpload';
import { Form } from '../../../dynamic/model/Form';
import { ExtCircReview } from './ExtCircReview';
import { ExtenuatingCircumstanceReviewDecision } from './ExtenuatingCircumstanceReviewDecision';
import { ExtCircType } from './ExtCircType';

export interface ExtenuatingCircumstance {
  id?: string;
  referenceNumber?: string;
  dynamicFormId?: string;
  subject?: string;
  renewalDate: string;
  sessionId: string;
  answers?: Array<FormAnswer>;
  proofs?: Array<any>;
  form?: Form;
  review?: ExtCircReview;
  type?: ExtCircType;
  decision?: ExtenuatingCircumstanceReviewDecision;
  submissionDate?;
}
