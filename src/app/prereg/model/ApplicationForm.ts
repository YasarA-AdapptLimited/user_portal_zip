import { ApplicationStatus } from './ApplicationStatus';
import { FileUpload } from '../../shared/model/FileUpload';
import { FormAnswer } from '../../dynamic/model/FormAnswer';


export interface ApplicationForm {
  id: string;
  formStatus: ApplicationStatus;
  declarations: Array<{ dynamicFormId: string, answers: Array<FormAnswer> }>;
  attachments: Array<FileUpload>;
  isOverallDeclarationConfirmed: boolean;
}
