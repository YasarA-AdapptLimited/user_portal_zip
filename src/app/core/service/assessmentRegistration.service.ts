import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { CustomErrorHandler } from './CustomErrorHandler';
import { Observable } from 'rxjs/internal/Observable';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { tap, map } from 'rxjs/operators';
import { AssessmentRegistration } from '../../prereg/assessment-registration/model/AssessmentRegistration';
import { AssessmentRegistrationStep } from '../../prereg/assessment-registration/model/AssessmentRegistrationStep';
import { FileUpload } from '../../shared/model/FileUpload';
import { UploadType } from '../../shared/model/UploadType';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AssessmentRegistrationService extends ServiceBase {
  application: AssessmentRegistration;
  tutors;

  constructor(
    http: HttpClient,
    auth: AuthService,
    log: LogService,
    errorHandler: CustomErrorHandler
  ) {
    super(http, auth, log, errorHandler);
  }

  getAssessmentRegistrationApplication(
    registrantStatus: RegistrantStatus
  ): Observable<AssessmentRegistration> {
    return super.get('v1.0/assessmentregistrationform').pipe(
      map(data => {
        try {
          this.application = new AssessmentRegistration(data, registrantStatus);
        } catch (e) {
          this.log.error('Error loading application', e);
        }
        return this.application;
      })
    );
  }

  reSubmitApplication(formId) {
    return super.post('v1.0/assessmentregistrationform/resubmit', { formId });
  }

  setStep(formId, step: AssessmentRegistrationStep) {
    return super.post('v1.0/assessmentregistrationform/resetstep', { formId, step });
  }

  saveApplicationPayment() {
    return super.post('v1.0/payment/initiate2', { paymentType: 6 });
  }

  saveApplicationPaymentOld() {
    return super.post('v1.0/payment/initiate', { paymentType: 6 });
  }

  saveAssessmentRegistrationApplication(
    application: AssessmentRegistration
  ): Observable<AssessmentRegistration> {
    const payload: any = Object.assign({}, application);
    payload.form = application.activeForm;
    delete payload.forms;
    delete payload.activeForm;
    return super.post('v1.0/assessmentregistrationform', payload).pipe(
      tap(response => {
        application.activeForm.id = response.formId;
      })
    );
  }
  getSupportingDocument(file: FileUpload) {
    const url = `v1.0/${UploadType.AssessmentRegistrationDocuments}/files/${file.fileId}`;
    return this.getFileWithToken(url);
  }

  getAssessmentRegistrationSupportingDocs(file: FileUpload) {
    const url = `v1.0/${UploadType.AssessmentRegistrationDocuments}/files/${file.fileId}`;
    return this.getFileWithToken(url);
  }
}
