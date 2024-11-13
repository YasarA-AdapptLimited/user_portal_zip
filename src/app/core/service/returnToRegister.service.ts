import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { ReturnToRegisterStep } from '../../registration/return-to-register/model/ReturnToRegisterStep';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { ReturnToRegisterApplication } from '../../registration/return-to-register/model/ReturnToRegister';
import { AuthService } from './auth.service';
import { CustomErrorHandler } from './CustomErrorHandler';
import { LogService } from './log.service';
import { Observable, of as observableOf, } from 'rxjs';
import { FormTemplate } from '../../dynamic/model/FormTemplate';
import { FormGroupType } from '../../dynamic/model/FormGroupType';
import { FileUpload } from '../../shared/model/FileUpload';
import { UploadType } from '../../shared/model/UploadType';
import { PaymentType } from '../model/paymentType';
import { RegistrantType } from '../../../app/registration/model/RegistrantType';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReturnToRegisterService extends ServiceBase {

    application: ReturnToRegisterApplication;
    templateGroup: any;
    registrant : any;

    constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
        super(http, auth, log, errorHandler);
        this.registrant = auth.user.registrant;
    }

   

    getApplication(registrantStatus: RegistrantStatus) {
        return super.get('v1.0/returntoregisterapp/' + this.registrant.isRTRAppAvailable).pipe(map(data => {
            try {
                this.application = new ReturnToRegisterApplication(data, registrantStatus);
            } catch (e) {
                this.log.error('Error loading the application', e);
            }
            return this.application;
        }));
    }

    saveApplication(application) {
        const payload: any = Object.assign({}, application);
        payload.form = application.activeForm;
        delete payload.forms;
        delete payload.activeForm;
        return super.post('v1.0/returntoregisterapp', payload).pipe(tap(response => {
            application.activeForm.id = response.formId;
        }));
    }

    saveApplicationPayment() {

        switch (this.registrant.isRTRAppAvailable) {
            case 1:
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PharmacistRTRAppFeeVoluntaryRemovalLessThanMonth )});               
            case 2:
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PharmacistRTRAppFeeVoluntaryRemovalMoreThanMonth )});
            case 3:
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PharmacistRTRAppFeeAfterNonRenewalLessThanYear )});
            case 4:
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PharmacistRTRAppFeeAfterNonComplianceLessThanYear )});
            case 5:
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PhyTechRTRAppFeeVoluntaryRemovalLessThanMonth )});
            case 6:
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PhyTechRTRAppFeeVoluntaryRemovalMoreThanMonth )});
            case 7:
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PhyTechRTRAppFeeAfterNonRenewalLessThanYear )});
            case 8:
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PhyTechRTRAppFeeAfterNonComplianceLessThanYear )});        
            default:
                return 
        }
       
       
    }

    saveApplicationPaymentOld() {

        const url = 'v1.0/payment/initiate'; 

        switch (this.registrant.isRTRAppAvailable) {
            case 1:
                return super.post(url, { paymentType: (PaymentType.PharmacistRTRAppFeeVoluntaryRemovalLessThanMonth )});               
            case 2:
                return super.post(url, { paymentType: (PaymentType.PharmacistRTRAppFeeVoluntaryRemovalMoreThanMonth )});
            case 3:
                return super.post(url, { paymentType: (PaymentType.PharmacistRTRAppFeeAfterNonRenewalLessThanYear )});
            case 4:
                return super.post(url, { paymentType: (PaymentType.PharmacistRTRAppFeeAfterNonComplianceLessThanYear )});
            case 5:
                return super.post(url, { paymentType: (PaymentType.PhyTechRTRAppFeeVoluntaryRemovalLessThanMonth )});
            case 6:
                return super.post(url, { paymentType: (PaymentType.PhyTechRTRAppFeeVoluntaryRemovalMoreThanMonth )});
            case 7:
                return super.post(url, { paymentType: (PaymentType.PhyTechRTRAppFeeAfterNonRenewalLessThanYear )});
            case 8:
                return super.post(url, { paymentType: (PaymentType.PhyTechRTRAppFeeAfterNonComplianceLessThanYear )});        
            default:
                return 
        }
       
       
    }

    setStep(formId, step: ReturnToRegisterStep) {
        return super.post('v1.0/returntoregister/resetstep', { formId, step });
      }
      
    getSupportingDocument(file: FileUpload) {
        const url = `v1.0/${UploadType.ReturnToRegisterSupportingDocuments}/files/${file.fileId}`;
        return this.getFileWithToken(url);
      }

    getDeclarationFormTemplates(): Observable<Array<FormTemplate>> {
        if (this.templateGroup) {
          return observableOf(this.templateGroup);
        } else {
          return super.get(`v1.0/forms?group=`+FormGroupType.ReturnToRegisterApplicationDeclarationForms)
            .pipe(map(data => {
              this.templateGroup = data;
              return this.templateGroup;
            }));
        }
    }

    saveRestorationPayment() {
        const feeCode=this.application.restorationToRegisterFeeCode;
        const FEECODES = {
            pharmacistRestorationFee: '241REF',
            phyTechnicianRestorationFee: '242REF',
            pharmacistRestorationAndRenewalFee: '241RESREN',
            phyTechnicianRestorationAndRenewalFee: '242RESREN',
          }
        switch (feeCode) {           
            case FEECODES.pharmacistRestorationFee:
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PharmacistRestorationFee )});               
            case FEECODES.phyTechnicianRestorationFee:
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PhyTechnicianRestorationFee )});
            case FEECODES.pharmacistRestorationAndRenewalFee:
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PharmacistRestorationAndRenewalFee )});
            case FEECODES.phyTechnicianRestorationAndRenewalFee:
                return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.PhyTechnicianRestorationAndRenewalFee )});
            default:
                return 
        }
    }

    saveRestorationPaymentOld() {
        const url = 'v1.0/payment/initiate';
        const feeCode=this.application.restorationToRegisterFeeCode;
        const FEECODES = {
            pharmacistRestorationFee: '241REF',
            phyTechnicianRestorationFee: '242REF',
            pharmacistRestorationAndRenewalFee: '241RESREN',
            phyTechnicianRestorationAndRenewalFee: '242RESREN',
          }
        switch (feeCode) {           
            case FEECODES.pharmacistRestorationFee:
                return super.post(url, { paymentType: (PaymentType.PharmacistRestorationFee )});               
            case FEECODES.phyTechnicianRestorationFee:
                return super.post(url, { paymentType: (PaymentType.PhyTechnicianRestorationFee )});
            case FEECODES.pharmacistRestorationAndRenewalFee:
                return super.post(url, { paymentType: (PaymentType.PharmacistRestorationAndRenewalFee )});
            case FEECODES.phyTechnicianRestorationAndRenewalFee:
                return super.post(url, { paymentType: (PaymentType.PhyTechnicianRestorationAndRenewalFee )});
            default:
                return 
        }
    }
}