import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IndependentPrescriberApplication } from '../../registration/independent-precriber/model/IndependentPrescriberApplication';
import { AuthService } from './auth.service';
import { CustomErrorHandler } from './CustomErrorHandler';
import { LogService } from './log.service';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { IndependentPrescriberApplicationStep } from '../../registration/independent-precriber/model/IndependentPrescriberApplicationStep';
import { IndependentPrescriberData } from '../../registration/model/IndependentPrescriberData';
import { FileUpload } from '../../shared/model/FileUpload';
import { UploadType } from '../../shared/model/UploadType';
import { PaymentType } from '../model/paymentType';
import { CurrentApplicationService } from './prereg/currentApplication.service';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';

const mockApplication = {
    courseProvider: 'ABC',
    dateAwarded: new Date('08-30-2020'),
    clinicalSpecialities: 'Pharma ',
    isPrescriberRegistered: false,
    prescriberMentorName: 'Test Mentor Name',
    registrationNumber: 2902901,
    UKregulatoryBody: 'Pharm GPhC',
    documents: [],
    activeForm: {
        step: 1,
        declaration: {
            isQ1Confirmed: true,
            isQ2Confirmed: false,
            isQ3Confirmed: false,
            isQ4Confirmed: true,
            isQ5Confirmed: false
          }

    },
    mentorDetails: [
        {
            'tutorGPhCId': 'b1875ac5-7aaf-e411-80e6-005056851bfe',
            'name': 'Mr Test Tutor 1',
            'registrationNumber': '2044541',
            'startDate': '2019-09-19T00:00:00',
            'endDate': '2020-09-16T00:00:00'
        }
    ],
    forms: [
        {
            'countersignatures': [],
            'id': 'xyz',
            'formStatus': 4,
            'step': 1,
            'declaration': {
            'isQ1Confirmed': true,
            'isQ2Confirmed': false,
            'isQ3Confirmed': false,
            'isQ4Confirmed': true,
            'isQ5Confirmed': false
            }
        }
    ],
    equalityDiversity: {
        ethnicity: 1,
        ethnicityOther: 'asd',
        nationality: 2,
        religion: 1,
        religionOther: 'dfg',
        disabled: 1,
        disabilityDetails: 'str',
        gender: 3,
        sexualOrientation: 2
    },
    registrant: {
        title: 'mr',
        forenames: 'str',
        surname: 'ing'
    },
    applicationFee: 250
};

@Injectable()
export class IndependentPrescriberService extends ServiceBase {

    application: IndependentPrescriberApplication;
    paymentType: PaymentType;

    constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler,
        private currentAppService: CurrentApplicationService) {
        super(http, auth, log, errorHandler);
    }

    getApplication(registrantStatus: RegistrantStatus) {
        return super.get('v1.0/indyprescriberapp').pipe(map(data => {
            try {
                this.application = new IndependentPrescriberApplication(data, registrantStatus);
            } catch (e) {
                this.log.error('Error loading the application', e);
            }
            return this.application;
        }));
    }

    saveApplication(
        application: IndependentPrescriberApplication
      ): Observable<IndependentPrescriberApplication> {
        const payload: any = Object.assign({}, application);
        payload.form = application.activeForm;
        delete payload.forms;
        delete payload.activeForm;
        return super.post('v1.0/indyprescriberapp', payload).pipe(
          tap(response => {
            application.activeForm.id = response.formId;
          })
        );
      }

    sendToCountersigner(registrationNumber: string) {
        return super.post(
            `v1.0/indyprescriberapp/countersigner/${registrationNumber}`,
            {}
        );
    }

    recallFromCountersigner() {
        return super.delete(`v1.0/indyprescriberapp/countersigner/recall`);
    }

    saveApplicationPayment() {
        return super.post('v1.0/payment/initiate2', { paymentType: PaymentType.IndependentPrescriberApplicationFee });
    }

    saveApplicationPaymentOld() {
      return super.post('v1.0/payment/initiate', { paymentType: PaymentType.IndependentPrescriberApplicationFee });
    }

    getCountersignerForm(countersignatureId): Observable<IndependentPrescriberData> {
        return super
          .get(`v1.0/indyprescriberapp/countersignature/${countersignatureId}`)
          .pipe(map(data => new IndependentPrescriberData(data)));
      }
    setStep(formId, step) {
        return super.post('v1.0/indyprescriberapp/resetstep', { formId, step });
    }

    submitCountersignatureOutcome(payload) {
        return super.post(
          'v1.0/indyprescriberapp/countersignature/decision',
          payload
        );
      }

      getProof(file: FileUpload) {
        const url = `v1.0/${UploadType.InpendentPrescriberSupportDocuments}/files/${file.fileId}`;
        return this.getFileWithToken(url);
      }

      download(url: string) {
        return this.getFile(url);
    }
}
