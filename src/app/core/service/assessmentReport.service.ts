import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { CustomErrorHandler } from './CustomErrorHandler';
import { Observable } from 'rxjs/internal/Observable';
import { ApplicationStatus } from '../../prereg/model/ApplicationStatus';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { FileUpload } from '../../shared/model/FileUpload';
import { UploadType } from '../../shared/model/UploadType';
import { tap, map } from 'rxjs/operators';
import { of as observableOf, from as observableFrom, of } from 'rxjs';
import { TechnicianApplication } from '../../technician/model/TechnicianApplication';
import { AssessmentReport } from '../../prereg/assessment-report/models/AssessmentReport';
import { FormTemplate } from '../../dynamic/model/FormTemplate';
import { AssessmentReportStep } from '../../prereg/assessment-report/models/AssessmentReportStep';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AssessmentReportService extends ServiceBase {
  application: any;
  tutors;
  templateGroup;

  constructor(
    http: HttpClient,
    auth: AuthService,
    log: LogService,
    errorHandler: CustomErrorHandler
  ) {
    super(http, auth, log, errorHandler);
  }

  getAssessmentReportApplication(
    registrantStatus: RegistrantStatus
  ): Observable<AssessmentReport> {
    return super.get('v1.0/progressreportform').pipe(
      map(data => {
        try {
          // console.log({ backendData: data });
          this.application = new AssessmentReport(data, registrantStatus);
        } catch (e) {
          this.log.error('Error loading application', e);
        }
        return this.application;
      })
    );
  }

  getTutors(): Observable<any> {
    if (this.tutors) {
      return observableOf(this.tutors);
    } else {
      return super.get(`v1.0/progressreportform`).pipe(
        tap(result => {
          this.tutors = result;
        })
      );
    }
  }

  getDeclarationFormTemplates(): Observable<Array<FormTemplate>> {
    if (this.templateGroup) {
      return observableOf(this.templateGroup);
    } else {
      return super.get(`v1.0/forms?group=5`)
        .pipe(map(data => {
          this.templateGroup = data;
          return this.templateGroup;
        }));
    }
  }

  cancelCountersignature(formId) {
    return super.post('v1.0/progressreportform/update', {
      formId,
      status: ApplicationStatus.InProgress
    });
  }

  reSubmitApplication(formId) {
    return super.post('v1.0/progressreportform/resubmit', { formId });
  }

  submitProgressReportForm(formId) {
    return super.post('v1.0/progressreportform/trainee/feedback', formId);
  }

  setStep(formId, step: AssessmentReportStep) {
    return super.post('v1.0/progressreportform/resetstep', { formId, step });
  }

  saveAssessmentReportApplication(
    application: AssessmentReport
  ): Observable<AssessmentReport> {
    const payload: any = Object.assign({}, application);
    payload.form = application.activeForm;
    delete payload.forms;
    delete payload.activeForm;
    delete payload.tutoredBy;
    delete payload.training;
    return super.post('v1.0/progressreportform', payload).pipe(
      tap(response => {
        application.activeForm.id = response.formId;
      })
    );
  }

  sendToCountersigner(registrationNumber: string) {
    return super.post(
      `v1.0/progressreportform/countersigner/${registrationNumber}`,
      {}
    );
  }

  getCountersignerForm(countersignatureId): Observable<AssessmentReport> {
    return super
      .get(`v1.0/countersigner/registrationform/${countersignatureId}`)
      .pipe(map(data => new AssessmentReport(data, null)));
  }

  getTechnicianCountersignerForm(countersignatureId) {
    return super
      .get(`v1.0/countersigner/registrationform/${countersignatureId}`)
      .pipe(map(data => new TechnicianApplication(data, null)));
  }

  submitCountersignatureOutcome(payload) {
    return super.post(
      'v1.0/progressreportform/countersigner/countersignatures/decision',
      payload
    );
  }

  getCountersignatureRequests(pharmacistRegNumber: string) {
    return super.get('v1.0/countersigner/countersignatures');
  }

  recallFromCountersigner() {
    return super.delete(`v1.0/progressreportform/countersigner/recall`);
  }

  getSupportingDocument(file: FileUpload) {
    const url = `v1.0/${UploadType.RegistrationFormSupportingDocuments}/files/${file.fileId}`;
    return this.getFileWithToken(url);
  }

  getProgressReportSupportingDocs(file: FileUpload) {
    const url = `v1.0/${UploadType.ProgressReportSupportingDocuments}/files/${file.fileId}`;
    console.log({ url });
    return this.getFileWithToken(url);
  }
}
