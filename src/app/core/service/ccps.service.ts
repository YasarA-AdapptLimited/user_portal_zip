import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of as observableOf, } from 'rxjs';
import { map, tap } from "rxjs/operators";
import { FormTemplate } from "../../../app/dynamic/model/FormTemplate";
import { CCPSApplication } from "../../registration/ccps/model/ccpsApplication";
import { RegistrantStatus } from "../../registration/model/RegistrantStatus";
import { PaymentType } from "../model/paymentType";
import { AuthService } from "./auth.service";
import { CustomErrorHandler } from "./CustomErrorHandler";
import { LogService } from "./log.service";
import { CCPSApplicationStep } from "../../../app/registration/ccps/model/ccpsApplicationStep";
import { RegulatoryBodies } from "../../registration/ccps/model/regulatoryBodies";
import { Qualification, RegistrationRoute } from "../../registration/ccps/model/CCPSDetails";
import { FileUpload } from "../../shared/model/FileUpload";
import { UploadType } from "../../shared/model/UploadType";
import { ServiceBase } from "./service.base";
import { HttpClient } from "@angular/common/http";
import { eeaDirectiveRoute } from "../../registration/ccps/model/initialPharmacyQualificationDetail";

const mockApplication = {
    regulator : 'regulator',
    form: {
        formStatus: 1,
        step: 1,
    }
};

@Injectable()
export class CCPSService extends ServiceBase{

  application: CCPSApplication;
  templateGroup: any;
  EEARegulatorSelected: boolean;
    constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
        super(http, auth, log, errorHandler);
    }

    getApplication(registrantStatus: RegistrantStatus, formId: number) {
       // return of(new CCPSApplication(mockApplication, registrantStatus));
       let url = formId ? 'v1.0/professionalstandingapp/'+formId : 'v1.0/professionalstandingapp';
        return super.get(url).pipe(map(data => {
            try{
                this.application = new CCPSApplication(data, registrantStatus);
            } catch(e) {
                this.log.error('Error loading the application', e);
            }
            return this.application;
        }))
    }

    setStep(formId, step: CCPSApplicationStep) {
        return super.post('v1.0/professionalstandingapp/resetstep', { formId, step });
    }

    setIsEEARegulatorSelected(value: boolean){
      this.EEARegulatorSelected = value;
    }

    saveApplication(application: CCPSApplication) {
        const payload: any = Object.assign({}, application);
        payload.form = application.activeForm;
        payload.form.initialRegistrantQualificationDetail.registrationRoute = application.personalDetails.registration.registrationRoute;
        payload.form.personalDetails = application.personalDetails;
        if(payload.form.initialRegistrantQualificationDetail.eeaPharmacistQualificationDetail?.eeaDirectiveRoute) {
          if(typeof(payload.form.initialRegistrantQualificationDetail.eeaPharmacistQualificationDetail.eeaDirectiveRoute) === 'string') {
            payload.form.initialRegistrantQualificationDetail.eeaPharmacistQualificationDetail.eeaDirectiveRoute = eeaDirectiveRoute[payload.form.initialRegistrantQualificationDetail.eeaPharmacistQualificationDetail.eeaDirectiveRoute];
          }
        }
        delete payload.forms;
        delete payload.activeForm;
        delete payload.personalDetails;
        delete payload.countries;
        delete payload.regulatoryBodies;
        delete payload.certProfessionalStandingApplicationFee;
        
        return super.post('v1.0/professionalstandingapp', payload).pipe(tap(response => {
            application.activeForm.id = response.formId;
            localStorage.setItem('ccpsFormActive', JSON.stringify(response.formId));
        }
        ));
        }

        getDeclarationFormTemplates(): Observable<Array<FormTemplate>> {
            if (this.templateGroup) {
              return observableOf(this.templateGroup);
            } else {
              return super.get(`v1.0/forms?type=20`)
                .pipe(map(data => {
                  this.templateGroup = data;
                  return this.templateGroup;
                }));
            }
          }
          
        saveApplicationPayment() {
            return super.post('v1.0/payment/initiate2', { paymentType: (PaymentType.CertOfProfessionalStandingApplicationFee )});
        }

        saveApplicationPaymentOld() {
          return super.post('v1.0/payment/initiate', { paymentType: (PaymentType.CertOfProfessionalStandingApplicationFee )});
      }

        getQualificationsList(){
          return super.get('v1.0/qualification');
        }

    getRegulatorSelected(): RegulatoryBodies {
          let index = 0, regulatoryBody;
          while (index < this.application.regulatoryBodies.length) {
            if (this.application.regulatoryBodies[index].country === this.application.activeForm.professionalStandingDetail.country) {
              regulatoryBody = this.application.regulatoryBodies[index];
              break;
            }
            index++;
          }
          return regulatoryBody;
    }

    getDoc(file: FileUpload) {
      const url = `v1.0/${UploadType.ProfessionalStandingSupportingDocuments}/files/${file.fileId}`;
      return this.getFileWithToken(url);
    }
}
