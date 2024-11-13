import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { CustomErrorHandler } from './CustomErrorHandler';
import { Observable } from 'rxjs/internal/Observable';
import { FormTemplate } from '../../dynamic/model/FormTemplate';
import { RegApplication } from '../../prereg/model/RegApplication';
import { ApplicationStatus } from '../../prereg/model/ApplicationStatus';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { FileUpload } from '../../shared/model/FileUpload';
import { UploadType } from '../../shared/model/UploadType';
import { tap, map } from 'rxjs/operators';
import { of as observableOf, from as observableFrom, of } from 'rxjs';
import { PreregApplicationStep } from '../../shared/model/student/PreregApplicationStep';
import { TechnicianApplication } from '../../technician/model/TechnicianApplication';
import { FormScope } from '../../registration/model/FormScope';
import { CurrentApplicationService } from './prereg/currentApplication.service';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';



@Injectable() export class PreregService extends ServiceBase {

  templateGroup;
  application: RegApplication;

  constructor(http: HttpClient, auth: AuthService, log: LogService,
    errorHandler: CustomErrorHandler, private currentAppService: CurrentApplicationService) {
    super(http, auth, log, errorHandler);
  }

  /* 
    Mock of for AROS applications
  */
  getApplicationDetails(): Observable<any> {
    return super.get('v1.0/trainee/availableform').pipe(map(data => {
      try {
        this.application = data;
        // { availableForm: 0}


        switch (data.availableForm) {
          case data.availableForm === FormScope.ProgressReport:

            break;
          case data.availableForm === FormScope.Trainee:
            // work out which form it is

            break;
          case data.availableForm === FormScope.FinalDeclaration:
            break;
          default:
            break;
        }



      } catch (e) {
        this.log.error('Error loading application', e);
      }
      return this.application;
    }));
  }


  getAvailableForm(): Observable<number> {
    return super.get('v1.0/trainee/availableform').pipe(
      map(data => {
        this.currentAppService.availableForm.next(data.availableForm);
        return data.availableForm;
      })
    );
  }

  /* 
    Mock of for AROS applications
  */


  getRegApplication(registrantStatus: RegistrantStatus): Observable<RegApplication> {
    return super.get('v1.0/registrationform').pipe(map(data => {
      try {
        this.application = new RegApplication(data, registrantStatus);
      } catch (e) {
        this.log.error('Error loading application', e);
      }
      return this.application;
    }));

  }


  getDeclarationFormTemplates(): Observable<Array<FormTemplate>> {
    if (this.templateGroup) {
      return observableOf(this.templateGroup);
    } else {
      return super.get(`v1.0/forms?group=3`)
        .pipe(map(data => {
          this.templateGroup = data;
          return this.templateGroup;
        }));
    }
  }

  cancelCountersignature(formId) {
    return super.post('v1.0/registrationform/update',
      { formId, status: ApplicationStatus.InProgress });
  }

  reSubmitApplication(formId) {
    return super.post('v1.0/registrationform/resubmit', { formId });
  }

  setStep(formId, step: PreregApplicationStep) {
    return super.post('v1.0/registrationform/resetstep', { formId, step });
  }

  saveRegApplication(application: RegApplication): Observable<RegApplication> {
    const payload: any = Object.assign({}, application);
    payload.form = application.activeForm;
    delete payload.forms;
    delete payload.activeForm;
    delete payload.tutoredBy;
    delete payload.assessment;
    delete payload.training;
    delete payload.reports;
    return super.post('v1.0/registrationform', payload).pipe(tap(response => {
      application.activeForm.id = response.formId;
    }));
  }

  saveApplicationPayment() {
    return super.post('v1.0/payment/initiate2', { paymentType: 1 });
  }
  saveFirstYearPayment() {
    return super.post('v1.0/payment/initiate2', { paymentType: 2 });
  }

  saveApplicationPaymentOld() {
    return super.post('v1.0/payment/initiate', { paymentType: 1 });
  }
  saveFirstYearPaymentOld() {
    return super.post('v1.0/payment/initiate', { paymentType: 2 });
  }

  sendToCountersigner(pharmacistRegNumber: string) {
    return super.post(`v1.0/registrationform/countersigner/${pharmacistRegNumber}`, {});
  }

  getCountersignerForm(id) {
    return super.get(`v1.0/countersigner/registrationform/${id}`)
      .pipe(map(data => new RegApplication(data, null)));
  }

  getTechnicianCountersignerForm(id) {
    return super.get(`v1.0/countersigner/registrationform/${id}`)
      .pipe(map(data => new TechnicianApplication(data, null)));
  }

  submitCountersignatureOutcome(payload) {
    return super.post('v1.0/countersigner/countersignatures/decision', payload);
  }

  getCountersignatureRequests(pharmacistRegNumber: string) {
    return super.get('v1.0/countersigner/countersignatures');
  }

  recallFromCountersigner() {
    return super.delete(`v1.0/registrationform/countersigner/recall`);
  }

  getSupportingDocument(file: FileUpload) {
    const url = `v1.0/${UploadType.RegistrationFormSupportingDocuments}/files/${file.fileId}`;
    return this.getFileWithToken(url);
  }

  getStudentSupportingDocs(file: FileUpload) {
    const url = `v1.0/${UploadType.PreRegistrationFormSupportingDocuments}/files/${file.fileId}`;
    return this.getFileWithToken(url);
  }
}
