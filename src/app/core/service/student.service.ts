import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { CustomErrorHandler } from './CustomErrorHandler';
import { Observable } from 'rxjs/internal/Observable';
import { Qualification } from '../../shared/model/student/Qualification';
import { PreregApplication } from '../../shared/model/student/PreregApplication';
import { PreregApplicationStep } from '../../shared/model/student/PreregApplicationStep';
import { FileUpload } from '../../shared/model/FileUpload';
import { UploadType } from '../../shared/model/UploadType';
import { tap, map } from 'rxjs/operators';
import { of as observableOf, from as observableFrom } from 'rxjs';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { FormTemplate } from '../../dynamic/model/FormTemplate';
import { PreregApplicationForm } from '../../shared/model/student/PreregApplicationForm';
import { ApplicationStatus } from '../../prereg/model/ApplicationStatus';
import { Placement } from '../../shared/model/student/Placement';
import { TrainingSchemeType } from '../../shared/model/student/TrainingSchemeType';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';

const mockApplication = {
  trainee: {
    title: { name: 'Mr', id: 123 },
    forenames: 'Donald',
    middleName: '',
    surname: 'Trump',
    address: {
      line1: '10 street',
      line2: '',
      line3: '',
      town: 'New York',
      county: '',
      postcode: 'ASBC',
      country: 'USA'
    },
    contact: {
      email: 'donald@trump.com',
      mobilePhone: '',
      telephone1: '45674534'
    },
    dateOfBirth: '1945-10-12T00:00:00',
    qualification: { courseName: 'MPharm DeMonfort', courseType: 123 },
    equalityDiversity: undefined
  },
  forms: [new PreregApplicationForm({ formStatus: ApplicationStatus.NotStarted }, RegistrantStatus.Applicant)]
};

const applicationSaveConfig = (application: PreregApplication, step: PreregApplicationStep) => {
  let config;
  switch (step) {
    case PreregApplicationStep.Training:
      config = {
        endpoint: 'v1.0/preregform/placement',
        payload: {
          placements: application.activeForm.placements.map(placement => placement.toJson()),
          trainingScheme: application.activeForm.trainingScheme
        },
        map: response => {
          response.placements.map((placement, i) => {
            const applicationFormPlacement = application.activeForm.placements[i];
            placement.tutors.map((tutors, index) => {
              applicationFormPlacement.tutors[index].tutoredById = tutors.tutoredById;
            });
            applicationFormPlacement.trainingSite.trainedAtId = placement.trainingSite.trainedAtId;
            applicationFormPlacement.placementId = placement.placementId;
          });
        }
      };
      break;
    default:
      const payload: any = Object.assign({}, application);
      payload.form = Object.assign({}, application.activeForm);
      delete payload.form.placements;
      delete payload.forms;
      delete payload.activeForm;
      config = {
        endpoint: 'v1.0/preregform',
        payload,
        map: response => {
          if (response.formId) {
            application.activeForm.id = response.formId;
          }
        }
      };
  }
  return config;
};

@Injectable()
export class StudentService extends ServiceBase {

  constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
    super(http, auth, log, errorHandler);
  }

  templateGroup;
  application: PreregApplication;

  getQualifications(): Observable<Array<Qualification>> {
    return super.get('v1.0/qualification')
      .pipe(map(data => data.qualifications));
  }

  getApplication(registrantStatus: RegistrantStatus): Observable<PreregApplication> {
    /* return observableOf(new PreregApplication(mockApplication, registrantStatus));*/
    return super.get('v1.0/preregform').pipe(map(data => {
      try {
        this.application = new PreregApplication(data, registrantStatus);
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
      return super.get(`v1.0/forms?type=10`)
        .pipe(map(data => {
          this.templateGroup = data;
          return this.templateGroup;
        }));
    }
  }

  cancelCountersignature(formId) {
    return super.post('v1.0/preregform/update',
      { formId, status: ApplicationStatus.InProgress });
  }

  reSubmitApplication(formId) {
    return super.post('v1.0/preregform/resubmit', { formId });
  }

  setStep(formId, step: PreregApplicationStep) {
    return super.post('v1.0/preregform/resetstep', { formId, step });
  }

  saveApplication(application: PreregApplication, step: PreregApplicationStep): Observable<PreregApplication> {
    const config = applicationSaveConfig(application, step);
    return super.post(config.endpoint, config.payload).pipe(tap(config.map));
  }

  getPlacements(formId?: any): Observable<{ placements: Array<Placement>, trainingScheme: { type: TrainingSchemeType, number: string }}> {
    return super.get('v1.0/preregform/placement', {'formId': formId}).pipe(map(data => {
      let placements: Array<Placement>;
      if (!data.placements.length) {
        placements = [new Placement()];
      } else {
        placements = data.placements.map(placement => new Placement(placement));
      }
      placements.forEach(placement => {
        placement.trainingWindow = {
          start: {
            from: new Date(data.trainingDetails.startDateForCurrentYear.split('T')[0]),
            to: new Date(data.trainingDetails.firstTrainingCloseDateForCurrentYear.split('T')[0])
          },
          end: { to: undefined }
        };
      });
      return {
        placements,
        trainingScheme: data.trainingScheme
      };
    }));
  }


  saveApplicationPayment() {
    return super.post('v1.0/payment/initiate2', { paymentType: 3 });
  }

  saveApplicationPaymentOld() {
    return super.post('v1.0/payment/initiate', { paymentType: 3 });
  }

  sendLearningContracts() {
    return super.post(`/v1.0/preregform/learningcontract`, {});
  }

  getCountersignerForm(id) {
    return super.get(`v1.0/countersigner/registrationform/${id}`)
      .pipe(map(data => new PreregApplication(data, null)));
  }

  submitCountersignatureOutcome(payload) {
    return super.post('v1.0/countersigner/countersignatures/decision', payload);
  }

  getCountersignatureRequests(pharmacistRegNumber: string) {
    return super.get('v1.0/countersigner/countersignatures');
  }

  recallFromCountersigner() {
    return super.delete(`v1.0/preregform/countersigner/recall`);
  }

  getSupportingDocument(file: FileUpload) {
    const url = `v1.0/${UploadType.RegistrationFormSupportingDocuments}/files/${file.fileId}`;
    return this.getFileWithToken(url);
  }

  sendLearningContract(data) {
    return super.post('/v1.0/preregform/learningcontract', { data });
  }

}
