import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { CustomErrorHandler } from './CustomErrorHandler';
import { Observable } from 'rxjs/internal/Observable';
import { TechnicianApplication } from '../../technician/model/TechnicianApplication';
import { TechnicianApplicationStep } from '../../technician/model/TechnicianApplicationStep';
import { FileUpload } from '../../shared/model/FileUpload';
import { UploadType } from '../../shared/model/UploadType';
import { tap, map } from 'rxjs/operators';
import { of as observableOf, from as observableFrom, of } from 'rxjs';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { FormTemplate } from '../../dynamic/model/FormTemplate';
import { PreregApplicationForm } from '../../shared/model/student/PreregApplicationForm';
import { ApplicationStatus } from '../../prereg/model/ApplicationStatus';
import { TechnicianActivation } from '../../account/activation/model/TechnicianActivation';
import { TechnicianQualificationType } from '../../technician/model/TechnicianQualificationType';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';


const applicationSaveConfig = (application: TechnicianApplication, step: TechnicianApplicationStep) => {
  const payload: any = Object.assign({}, application);
  payload.form = Object.assign({}, application.activeForm);
  payload.form.workExperiences = application.activeForm.workExperiences.map((experience) => {
    const jsonPayload = experience.toJson();
    const expectedWorkExperiencemembers = ['startDate', 'endDate', 'workedHoursPerWeek',
      'jobtitle', 'supervisingPharmacist', 'premise'];
    return (Object.keys(jsonPayload).length < expectedWorkExperiencemembers.length) ? null : jsonPayload;
  });

  function formatExperience(workExperiences: Array<any>): boolean {
    const experienceProps = [];
    const hasValidWorkExperiences = workExperiences.every(exp => !!exp);
    workExperiences.forEach((experience) => {
      for (const key in experience) {
        experienceProps.push(experience[key]);
      }
    });
    const hasValidExperienceProperties = experienceProps.every(prop => !!prop);
    return hasValidWorkExperiences && hasValidExperienceProperties;
  }

  const validExperiences = formatExperience(payload.form.workExperiences);

  if (!validExperiences) {
    payload.form.workExperiences = [];
  }

  // console.log({ payload :payload.form});
  delete payload.forms;
  delete payload.activeForm;
  const config = {
    endpoint: 'v1.0/technicianform',
    payload,
    map: response => {
      if (response.formId) {
        application.activeForm.id = response.formId;
      }
    }
  };

  return config;
};

@Injectable({
  providedIn: 'root'
})
export class TechnicianService extends ServiceBase {

  constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
    super(http, auth, log, errorHandler);
  }

  templateGroup;
  application: TechnicianApplication;

  /* 
  Start of pharmacy technician calls
  */

  tempSignUp(activation: TechnicianActivation) {
    const payload = {
      forenames: activation.forenames,
      surname: activation.surname,
      middleName: activation.middleName,
      dateOfBirth: activation.dob
    };
    return super.post(`v1.0/temp/signup`, payload);
  }


  getTechnicianDetails() {
    return super.get('v1.0/temp/signup').pipe(
      map(technicianDetails => {
        const payload = {
          forenames: technicianDetails.forenames,
          surname: technicianDetails.surname,
          middleName: technicianDetails.middleName,
          dob: technicianDetails.dateOfBirth
        }
        return payload;
      }));
  }

  confirmTechnicianDetails(activation: TechnicianActivation) {
    const payload = {
      forenames: activation.forenames,
      surname: activation.surname,
      middleName: activation.middleName,
      dateOfBirth: activation.dob
    };
    return super.post(`v1.0/temp/confirm`, payload);
  }

  getQualificationList(qualificationType: TechnicianQualificationType) {
    return super.get(`v1.0/qualification/?QualificationType=${qualificationType}`)
      .pipe(map(data => data.qualifications));
  }


  getApplication(registrantStatus: RegistrantStatus): Observable<TechnicianApplication> {
    /* return observableOf(new PreregApplication(mockApplication, registrantStatus));*/
    return super.get('v1.0/technicianform').pipe(map(data => {
      try {
        this.application = new TechnicianApplication(data, registrantStatus);
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
      return super.get(`v1.0/forms?group=4`)
        .pipe(map(data => {
          this.templateGroup = data;
          return this.templateGroup;
        }));
    }
  }


  sendToCountersigner(regNumber: string) {
    return super.post(`v1.0/technicianform/countersigner/${regNumber}`, {});
  }


  recallFromCountersigner() {
    return super.post(`v1.0/technicianform/countersigner/recall`, {});
  }

  getSupportingDocuments(file: FileUpload) {
    const url = `v1.0/${UploadType.PharmacyTechnicianSupportingDocuments}/files/${file.fileId}`;
    return this.getFileWithToken(url);
  }



  saveApplicationPayment() {
    return super.post('v1.0/payment/initiate2', { paymentType: 4 });
  }

  saveApplicationPaymentOld() {
    return super.post('v1.0/payment/initiate', { paymentType: 4 });
  }


  saveApplication(application: TechnicianApplication, step: TechnicianApplicationStep): Observable<TechnicianApplication> {
    const config = applicationSaveConfig(application, step);
    return super.post(config.endpoint, config.payload).pipe(tap(config.map));
  }



  getSupportingDocument(file: FileUpload) {
    const url = `v1.0/${UploadType.PharmacyTechnicianSupportingDocuments}/files/${file.fileId}`;
    return this.getFileWithToken(url);
  }


  submitCountersignatureOutcome(payload) {
    return super.post('v1.0/technicianapplicant/countersigner/countersignatures/decision', payload);
  }


  setStep(formId, step: TechnicianApplicationStep) {
    return super.post('v1.0/technicianform/resetstep', { formId, step });
  }


  cancelCountersignature(formId) {
    return super.post('v1.0/technicianform/update',
      { formId, status: ApplicationStatus.InProgress });
  }

  saveFirstYearPayment() {
    return super.post('v1.0/payment/initiate2', { paymentType: 5 });
  }

  saveFirstYearPaymentOld() {
    return super.post('v1.0/payment/initiate', { paymentType: 5 });
  }



  /* 
    End of pharmacy technician calls
  */



  reSubmitApplication(formId) {
    return super.post('v1.0/preregform/resubmit', { formId });
  }


  sendLearningContracts() {
    return super.post(`/v1.0/preregform/learningcontract`, {});
  }

  getCountersignerForm(id) {
    return super.get(`v1.0/countersigner/registrationform/${id}`)
      .pipe(map(data => new TechnicianApplication(data, null)));
  }


  getCountersignatureRequests(pharmacistRegNumber: string) {
    return super.get('v1.0/countersigner/countersignatures');
  }



  sendLearningContract(data) {
    return super.post('/v1.0/preregform/learningcontract', { data });
  }

}
