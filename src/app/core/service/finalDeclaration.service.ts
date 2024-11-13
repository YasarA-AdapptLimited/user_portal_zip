import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { CustomErrorHandler } from './CustomErrorHandler';
import { Observable } from 'rxjs/internal/Observable';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { tap, map } from 'rxjs/operators';
import { of as observableOf, from as observableFrom, of } from 'rxjs';
import { FinalDeclaration } from '../../prereg/final-declaration/model/FinalDeclaration';
import { FinalDeclarationStep } from '../../prereg/final-declaration/model/FinalDeclarationStep';
import { ApplicationStatus } from '../../prereg/model/ApplicationStatus';
import { FormTemplate } from '../../dynamic/model/FormTemplate';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class FinalDeclarationService extends ServiceBase {
  application: FinalDeclaration;
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

  getFinalDeclarationApplication(
    registrantStatus: RegistrantStatus
  ): Observable<FinalDeclaration> {
    return super.get('v1.0/finaldeclarationform').pipe(
      map(data => {
        try {
          this.application = new FinalDeclaration(data, registrantStatus);
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
      return super.get(`v1.0/finaldeclarationform`).pipe(
        tap(result => {
          this.tutors = result;
          console.log(result);
        })
      );
    }
  }

  setStep(formId, step: FinalDeclarationStep) {
    return super.post('v1.0/finaldeclarationform/resetstep', { formId, step });
  }

  saveFinalDeclarationApplication(
    application: FinalDeclaration
  ): Observable<FinalDeclaration> {
    const payload: any = Object.assign({}, application);
    payload.form = application.activeForm;
    delete payload.forms;
    delete payload.activeForm;
    delete payload.tutoredBy;
    delete payload.training;
    return super.post('v1.0/finaldeclarationform', payload).pipe(
      tap(response => {
        application.activeForm.id = response.formId;
      })
    );
  }

  sendToCountersigner(registrationNumber: string) {
    return super.post(
      `v1.0/finaldeclarationform/countersigner/${registrationNumber}`,
      {}
    );
  }

  recallFromCountersigner() {
    return super.delete(`v1.0/finaldeclarationform/countersigner/recall`);
  }

  getCountersignerForm(countersignatureId): Observable<FinalDeclaration> {
    return super
      .get(`v1.0/countersigner/registrationform/${countersignatureId}`)
      .pipe(map(data => new FinalDeclaration(data, null)));
  }

  cancelCountersignature(formId) {
    return super.post('v1.0/registrationform/update',
      { formId, status: ApplicationStatus.InProgress });
  }
  submitCountersignatureOutcome(payload) {
    return super.post(
      'v1.0/finaldeclarationform/countersigner/countersignatures/decision',
      payload
    );
  }
  getDeclarationFormTemplates(): Observable<Array<FormTemplate>> {
    if (this.templateGroup) {
      return observableOf(this.templateGroup);
    } else {
      return super.get(`v1.0/forms?group=6`)
        .pipe(map(data => {
          this.templateGroup = data;
          return this.templateGroup;
        }));
    }
  }
  submitFinalDeclarationForm(formId) {
    return super.post('v1.0/finaldeclarationform/trainee/feedback', formId);
  }
}
