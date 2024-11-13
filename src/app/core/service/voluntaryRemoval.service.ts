import { Injectable, Input } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormTemplate } from '../../dynamic/model/FormTemplate';
import { ApplicationFormMode } from '../../prereg/model/ApplicationFormMode';
import { ApplicationStatus } from '../../prereg/model/ApplicationStatus';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { VoluntaryRemovalApplication } from '../../registration/voluntary-removal/model/VoluntaryRemovalApplication';
import { VoluntaryRemovalApplicationStep } from '../../registration/voluntary-removal/model/VoluntaryRemovalApplicationStep';
import { AuthService } from './auth.service';
import { CustomErrorHandler } from './CustomErrorHandler';
import { LogService } from './log.service';

import { tap, map } from 'rxjs/operators';
import { of as observableOf, from as observableFrom, of } from 'rxjs';
import { FormAnswer } from '../../dynamic/model/FormAnswer';
import { AnswerType } from '../../dynamic/model/AnswerType';
import { PaymentType } from '../model/paymentType';
import { RegistrantType } from '../../registration/model/RegistrantType';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';

const mockAppData = {

    trainee: {
        title: { name: 'XYZ', id: 0 },
        forenames: '',
        middleName: '',
        surname: '',
        address: {
            line1: 'XXX',
            line2: '',
            line3: '',
            town: 'YYY',
            county: 'ZZZ',
            postcode: 'X123',
            country: 'XYZ'
        },
        contact: {
            email: 'test@test.com',
            mobilePhone: '123456789',
            telephone1: ''
        },
        dateOfBirth: '01-01-1985',
        qualification: { courseName: 'pharmacy', courseType: 1 },
        equalityDiversity: {
            ethnicity: 0,
            ethnicityOther: '',
            nationality: 0,
            religion: 0,
            religionOther: '',
            disabled: 0,
            disabilityDetails: '',
            gender: 0,
            sexualOrientation: 0
        }
    },
    forms: [{
        id: '',
        formStatus: ApplicationStatus.InProgress,
        isMentorRegistered: false,
        declarations: [],
        attachments: [],
        isOverallDeclarationConfirmed: false,
        step: VoluntaryRemovalApplicationStep.DateReasonForRemovalRequired,
        minStep: VoluntaryRemovalApplicationStep.DateReasonForRemovalRequired,
        mode: ApplicationFormMode.Editable,
        registrantStatus: RegistrantStatus.Applicant
    }],
    activeForm: {
        id: '',
        formStatus: ApplicationStatus.InProgress,
        isMentorRegistered: false,
        declarations: [],
        attachments: [],
        isOverallDeclarationConfirmed: false,
        step: VoluntaryRemovalApplicationStep.DateReasonForRemovalRequired,
        minStep: VoluntaryRemovalApplicationStep.DateReasonForRemovalRequired,
        mode: ApplicationFormMode.Editable,
        declaration: {
            isQ1Confirmed: true,
            isQ2Confirmed: true
        },
        isSuperintendent: true,
        registrantStatus: RegistrantStatus.Applicant,
        removeFromTheRegister: true,
        finalDateOfRemoval: new Date('07-09-2022'),
        removalDateChosen: new Date('03-10-2022'),
        reasonForRemoval: null,
        details: null,
        hasAnnotation: true,
        ownerName: 'Mr.XXX YYY',
        ownerNumber: '1234567',
        equalityDiversity: {
            disabilityDetails: '',
            disabled: 981360000,
            ethnicity: 981360003,
            ethnicityOther: '',
            gender: 981360001,
            nationality: undefined,
            religion: 981360000,
            religionOther: '',
            sexualOrientation: 981360005
        },
        applicationFees: 256,
        feeDescription: 'quarterly renewal fee',
        collectionMethod: 'online',
        dueDate: '31/05/2022',
        amount: 256,
        outStandingFee: 256
    },
    status: ApplicationStatus.NotStarted
};

@Injectable()
export class VoluntaryRemovalService extends ServiceBase {

    application: VoluntaryRemovalApplication;
    templateGroup: any;
    dataSource: Subject<any> = new Subject<any>();
    data$: Observable<any>;
    PaymentType: PaymentType;
    RegistrantType: RegistrantType;
    type: PaymentType;
    registrant;
    isOutStandingPaymentZero = false;

    constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
        super(http, auth, log, errorHandler);
        this.registrant = auth.user.registrant;
        this.data$ = this.dataSource.asObservable();
    }

    sendFtpDeclarationAnswers(ftpAnsers) {
      this.dataSource.next(ftpAnsers);
      }

    get isPaymentPending() {
        return !this.isOutStandingPaymentZero;
    }

    isOutstandingPaymentZero(expiryDate, dateOfRemoval, pendingFee) {
            if (!expiryDate || !dateOfRemoval) {
                this.isOutStandingPaymentZero = false;
            } else {
                const expDate = new Date(expiryDate);
                const dayJustBeforeNextRenewalYear = expDate;
                dayJustBeforeNextRenewalYear.setFullYear(expDate.getFullYear() - 1);

                if (new Date(dateOfRemoval).setHours(0, 0, 0, 0) <= dayJustBeforeNextRenewalYear.setHours(0, 0, 0, 0)) {
                    this.isOutStandingPaymentZero = true;
                } else {
                    this.isOutStandingPaymentZero = !pendingFee;
                }
            }

            return this.isOutStandingPaymentZero;
    }



    getApplication(registrantStatus: RegistrantStatus) {
        return super.get('v1.0/voluntaryremovalapp').pipe(map(data => {
            try {
                this.application = new VoluntaryRemovalApplication(data, registrantStatus);
            } catch (e) {
                this.log.error('Error loading the application', e);
            }
            return this.application;
        }));
    }

    getDeclarationFormTemplates(): Observable<Array<FormTemplate>> {
        if (this.templateGroup) {
            return observableOf(this.templateGroup);
        } else {
            return super.get(`v1.0/forms?group=7`)
                .pipe(map(data => {
                    this.templateGroup = data;
                    return this.templateGroup;
                }));
        }
    }

    setStep(formId, step: VoluntaryRemovalApplicationStep) {
        return super.post('v1.0/voluntaryremovalapp/resetstep', { formId, step });
    }

    saveVRApplication(application) {
        const payload: any = Object.assign({}, application);
        payload.form = application.activeForm;
        delete payload.forms;
        delete payload.activeForm;
        return super.post('v1.0/voluntaryremovalapp', payload).pipe(tap(response => {
            application.activeForm.id = response.formId;
        }));
    }


    submitVoluntaryApplicationWithoutDues(formId) {
        return super.post('v1.0/voluntaryremovalapp/submit', formId);
      }

    saveApplicationPayment() {
        if (this.registrant.type === RegistrantType.Pharmacist) {
            if (this.application.outstandingPayments.length === 1) {
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PharmacistVRemoval1QuarterRenewalFee )});
            } else if (this.application.outstandingPayments.length === 2) {
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PharmacistVRemoval2QuarterRenewalFee )});
            } else if (this.application.outstandingPayments.length === 3) {
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PharmacistVRemoval3QuarterRenewalFee )});
            }
        } else if (this.registrant.type === RegistrantType.PharmacyTechnician) {
            if (this.application.outstandingPayments.length === 1) {
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PTechnicianVRemoval1QuarterRenewalFee )});
            } else if (this.application.outstandingPayments.length === 2) {
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PTechnicianVRemoval2QuarterRenewalFee )});
            } else if (this.application.outstandingPayments.length === 3) {
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PTechnicianVRemoval3QuarterRenewalFee )});
            }
        }
    }

    saveApplicationPaymentOld() {
        const url = 'v1.0/payment/initiate';
        if (this.registrant.type === RegistrantType.Pharmacist) {
            if (this.application.outstandingPayments.length === 1) {
                return super.post(url, { paymentType: (PaymentType.PharmacistVRemoval1QuarterRenewalFee )});
            } else if (this.application.outstandingPayments.length === 2) {
                return super.post(url, { paymentType: (PaymentType.PharmacistVRemoval2QuarterRenewalFee )});
            } else if (this.application.outstandingPayments.length === 3) {
                return super.post(url, { paymentType: (PaymentType.PharmacistVRemoval3QuarterRenewalFee )});
            }
        } else if (this.registrant.type === RegistrantType.PharmacyTechnician) {
            if (this.application.outstandingPayments.length === 1) {
                return super.post(url, { paymentType: (PaymentType.PTechnicianVRemoval1QuarterRenewalFee )});
            } else if (this.application.outstandingPayments.length === 2) {
                return super.post(url, { paymentType: (PaymentType.PTechnicianVRemoval2QuarterRenewalFee )});
            } else if (this.application.outstandingPayments.length === 3) {
                return super.post(url, { paymentType: (PaymentType.PTechnicianVRemoval3QuarterRenewalFee )});
            }
        }
    }

}
