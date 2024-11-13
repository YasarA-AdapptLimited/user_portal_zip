import { Component, OnInit, forwardRef, Input, ChangeDetectorRef } from "@angular/core";
import { FormStepperService } from "../../../../shared/formStepper/formStepper.service";
import { FormStepComponent } from "../../../../shared/formStepper/formStep.component";
import { CCPSApplicationStep } from "../../model/ccpsApplicationStep";
import { RegulatoryBodies } from "../../model/regulatoryBodies";
import { ProfessionalStandingDetail } from "../../model/professionalStandingDetail";
import { RegistrationService } from "../../../../core/service/registration.service";
import { CCPSApplication } from "../../model/ccpsApplication";

@Component({
  selector: "app-overseas-regular-details",
  templateUrl: "./overseas-regular-details.component.html",
  styleUrls: ["./overseas-regular-details.component.scss"],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => OverseasRegularDetailsComponent),
    },
  ],
})
export class OverseasRegularDetailsComponent
  extends FormStepComponent
  implements OnInit
{
  title = "Requesting regulator details";
  stepId = CCPSApplicationStep.OverseasRegularDetails;

  countrySelected;
  regulatorSelected;
  address;
  emailAddress;
  contactName;
  telNumber;
  toEmailAddress;
  professionalStandingDetail: ProfessionalStandingDetail;
  regulatoryBody: RegulatoryBodies;
  regulatoryBodiesSubmitted = [];
  isRegBodySubmitted = false;
  invalidTelNumber = false;

  @Input() application: CCPSApplication;
  countries: any;
  regulatoryBodies: any[];
  countryAndRegBodies = {};

  constructor(formStpperService: FormStepperService, 
    private registrationService: RegistrationService,
    private cd: ChangeDetectorRef) {
    super(formStpperService);
  }

  ngOnInit(): void {
    this.countries = this.application.countries?.sort();
    this.regulatoryBodies = [];
    this.professionalStandingDetail = this.application.activeForm.professionalStandingDetail;

    let ccpsFormDetails = localStorage.getItem('ccpsFormDetails');
    if(ccpsFormDetails) {
      JSON.parse(ccpsFormDetails).forEach( reg => {
        if(reg.formId !== this.application.activeForm.id) this.regulatoryBodiesSubmitted.push(reg.regulatoryBodyId);
     });
    }

    this.getRegulatorBodies();

    if (this.professionalStandingDetail) {
      this.selectCountryHandler(this.professionalStandingDetail.country);
      if(this.professionalStandingDetail?.regulatoryBodyId) this.selectRegulatoryBodyHandler(this.professionalStandingDetail.regulatoryBodyId);
    }

    this.ready$.next(true);
  }

  getRegulatorBodies(){
    this.application.regulatoryBodies.forEach((regBody:RegulatoryBodies) => {
      if(!this.countryAndRegBodies[regBody.country]) {
        this.countryAndRegBodies[regBody.country] = [regBody];
      } else{
        this.countryAndRegBodies[regBody.country].push(regBody);
      }
    });
  }

  populateForm() {}

  checkIfRegBodySubmitted(regBodySelected): boolean {
    if(!this.regulatoryBodiesSubmitted || this.regulatoryBodiesSubmitted.length === 0) return false;
    if(this.regulatoryBodiesSubmitted.indexOf(regBodySelected)>=0) this.isRegBodySubmitted = true; else this.isRegBodySubmitted = false;
  }

  isTelNumberValid() {
    let isValid;
    let regex = /^[0-9\+]*$/;
    if(!this.professionalStandingDetail.telephone) isValid = true;
    else isValid = regex.test(this.professionalStandingDetail.telephone);
    return isValid;
  }

  
  validate() {
    const messages = [];
    if(!this.professionalStandingDetail.country || this.professionalStandingDetail.country=="undefined"){
      messages.push('Please select country');
    }
    if(!this.professionalStandingDetail.regulatoryBodyId || this.isRegBodySubmitted){
      messages.push('Please select a right regulatory body');
    }
    
    if(!this.isTelNumberValid()) messages.push(`Please check that you have entered your mobile phone number correctly (only numbers and '+' allowed)`);

    this.validity$.next({ valid: messages.length === 0, messages, touched: this.touched });
  }

  onCountryChange(event) {
    this.professionalStandingDetail.regulatoryBodyId = null;
    this.cd.detectChanges();
    this.selectChangeCountryHandler(event?.target?.value);
  }

  selectChangeCountryHandler(data) {    
    this.selectCountryHandler(data);
    this.validate();
  }
  
  selectCountryHandler(data) {
    let value = data ? data : null;
    this.regulatoryBodies=[];

    if(!value){
      this.countrySelected=value;
      this.regulatorSelected=null;
      this.professionalStandingDetail.country = null;
      this.professionalStandingDetail.regulatoryBodyId = null;
    }
    else{
      this.countries = this.application.countries?.sort();
      this.countrySelected = value;

      if(this.countryAndRegBodies[value]) {
        this.regulatoryBodies = this.countryAndRegBodies[value].sort((regBody1, regBody2) => regBody1.name.localeCompare(regBody2.name));
      }

      let regBody; 
      regBody = this.professionalStandingDetail.regulatoryBodyId ? this.professionalStandingDetail.regulatoryBodyId : null;
      this.selectRegulatoryBodyHandler(regBody);
    }
  }

  selectChangeRegulatoryBodyHandler(value: any) {
    this.selectRegulatoryBodyHandler(value);    
    this.validate();
  }

  selectRegulatoryBodyHandler(value) {
    this.regulatoryBody = null;
    if(!value)
    {
      this.professionalStandingDetail.regulatoryBodyId = null;
    }
    else{
      this.regulatorSelected=value;
      this.countryAndRegBodies[this.professionalStandingDetail.country].forEach((regulatoryBody) => {
        if (regulatoryBody.id === value) {
          this.regulatoryBody = regulatoryBody;
        }
      });
    }
    this.checkIfRegBodySubmitted(this.professionalStandingDetail.regulatoryBodyId);
  }
}
