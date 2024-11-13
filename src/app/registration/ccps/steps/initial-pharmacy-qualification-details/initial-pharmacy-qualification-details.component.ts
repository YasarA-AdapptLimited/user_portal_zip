import { Component, OnInit, forwardRef, Input, ViewChild } from "@angular/core";
import { FormStepperService } from "../../../../shared/formStepper/formStepper.service";
import { FormStepComponent } from "../../../../shared/formStepper/formStep.component";
import { CCPSApplicationStep } from "../../model/ccpsApplicationStep";
import { Tooltip } from "../../../../../app/core/tooltip/Tooltip";
import { RegistrantType } from "../../../../../app/registration/model/RegistrantType";
import { AuthService } from "../../../../../app/core/service/auth.service";
import {
    EEACountries,
  EEADirectiveRoute,
  eeaDirectiveRoute,
  InitialRegistrantQualificationDetail,
  LegacyRegistrationRoute,
  trainingDetails,
  trainingSites,
} from "../../model/initialPharmacyQualificationDetail";
import { CourseType } from "../../../../../app/shared/model/student/CourseType";
import { AccountService } from "../../../../account/service/account.service";
import { CCPSService } from "../../../../core/service/ccps.service";
import { CCPSApplication } from "../../model/ccpsApplication";
import { NgForm } from "@angular/forms";
import utils from '../../../../shared/service/utils';
import { AttachmentType } from "../../../../shared/model/AttachmentType";
import { SupportingDocumentsService } from "../../../../shared/supportingDocuments/supportingDocuments.service";
import { UploadType } from "../../../../shared/model/UploadType";
import { Qualification, RegistrationRoute } from "../../model/CCPSDetails";
import { TrainingDetailsComponent } from "./training-details/training-details.component";


const MAX_TRAININGS: number = 5;
const MIN_YEARQUALIFIED = 1955;
const MIN_ASSESSMENTYEAR = 1993;
const MIN_EEAQUALIFIEDYEAR = 1960;
@Component({
  selector: "app-initial-pharmacy-qualification-details",
  templateUrl: "./initial-pharmacy-qualification-details.component.html",
  styleUrls: ["./initial-pharmacy-qualification-details.component.scss"],
  providers: [
    SupportingDocumentsService,
    {
      provide: FormStepComponent,
      useExisting: forwardRef(
        () => InitialPharmacyQualificationDetailsComponent
      ),
    },
  ],
})
export class InitialPharmacyQualificationDetailsComponent
  extends FormStepComponent
  implements OnInit
{
  title = "Initial pharmacy qualification details";
  stepId = CCPSApplicationStep.InitialPharmacyQualificationDetails;

  @ViewChild('form') form: NgForm;


  @Input() application: CCPSApplication;
  registrationRouteSwitchValue: string; //'Northern Ireland'//'OSPAP'//'UK'//'EEA' // 'NONEEA' // 'OSPAPWITH';
  registrationRoute: RegistrationRoute;
  isPharmacist: boolean = true;
  currentDate = new Date();
  currentYear = new Date().getFullYear(); 
  
  inputTrainingSiteName;
  inputTrainingSiteAddress;
  inputTrainingStartDate;
  inputTrainingEndDate;
  countryChanged = false;
  routeChanged = false;
  countriesList = [];
  showTrainingForm: boolean = false;
  editTrainingRow;
  newTrainingDetails = {
    siteName:null,
    siteAddress: null,
    startDate: null,
    endDate: null
  }
  errorMessages: Array<string> = [];
  editedTrainingDetails = {
    siteName: null,
    siteAddress: null,
    startDate: null,
    endDate: null
  };
  trainingDetail = {
    trainingSiteName: '',
    trainingSiteAddress: '',
    trainingStartDate: null,
    trainingEndDate: null
  }
  isEditTrainingDetails = false;
  trainingDetailsSaved = false;
  EEARegulatorSelected: boolean;
  invalidYearFormat: boolean;

  readonly: boolean = true;
  tooltipInfo: Tooltip = {
    id: "help",
    content: "Click here for more information.",
    width: 250,
    placement: "right",
    order: -1,
  };
  eeaDirectiveRoute = EEADirectiveRoute;
  countryFirstRecognised = EEACountries; 
  trainingDetails: trainingDetails[];
  
  countries: any;
  qualifications:any;
  qualificationsToSelectFrom: Qualification[] = [];
  otherThanOSPAPQualifications = [];  
  ospapQualifications = [];
  assessment: any;
  addTrainingFlag: boolean = false;
  initQualDetail: InitialRegistrantQualificationDetail;
  eeaDirectiveRouteSelected;
  PTQualifcationDetails = [];

  qualificationDetailsExists: {
    courseExists: boolean,
    qualifiedExists: boolean,
    countryExists: boolean
  };
  otherQualificationDetailsExists = {
    courseExists: false,
    qualifiedExists: false,
    countryExists: false
  }
  DELETE_URL = 'v1.0/pharmacistform/attachment';

  trainingDetailsExists;
  assessmentDetailsExists;
  startDateTouched: boolean = false;
  endDateTouched: boolean = false;
  sessionId = utils.guid();
  deleteUrl;
  attachmentType = AttachmentType.PharmcistCVForProfessionalStanding;
  uploadType = UploadType.ProfessionalStandingSupportingDocuments;
  courseExists: boolean = false;
  qualifiedExists: boolean = false;
  reciprocityCountries = ['Australia', 'New Zealand','South Africa'];
  attachments = [];

  @ViewChild('trainingDetailsComp') trainingDetailsComp: TrainingDetailsComponent;

  constructor(
    formStpperService: FormStepperService,
    private auth: AuthService,
    private accountService: AccountService,
    private ccpsService: CCPSService,
    private docService: SupportingDocumentsService
  ) {
    super(formStpperService);
  }


  ngOnInit(): void {
    this.getCountries();
    this.assessment = this.application.personalDetails.assessmentName ? this.application.personalDetails.assessmentName : null;
    this.qualificationDetailsExists = this.application.activeForm.qualificationDetailsExists;
    this.assessmentDetailsExists = this.application.activeForm.assessmentDetailsExists;
    this.deleteUrl = this.application.activeForm.attachments?.length > 0 ? this.DELETE_URL : '';

    this.ccpsService.getQualificationsList().subscribe((list) => {
      this.qualifications = list.qualifications;
      
      if (this.qualifications && this.qualifications.length > 0) {
        this.qualifications.forEach(qualification => {
          if (qualification.courseType === CourseType.OSPAP)
            this.ospapQualifications.push(qualification)
          else
            this.otherThanOSPAPQualifications.push(qualification)
        });
      }
    });
    this.countries = this.application.countries;

    if (this.auth.user) {
      this.isPharmacist = this.auth.user.registrant.type === RegistrantType.Pharmacist;

      this.initiateQualifcationDetails();
            
      this.registrationRoute = this.application.personalDetails.registration.registrationRoute;
      
      if(this.isPharmacist)
      {
        this.getRegistrationRoute();
      }
    }
    this.ready$.next(true);
  }

  get route(){
    return RegistrationRoute[this.registrationRoute];
  }

  get isEEARegulatorSelected() {
    const EEARegulatorSelected = !this.application.activeForm.professionalStandingDetail.country ? true : this.countryFirstRecognised.includes(this.application.activeForm.professionalStandingDetail.country);
    this.ccpsService.setIsEEARegulatorSelected(EEARegulatorSelected);
    return EEARegulatorSelected;
  }

  initiateQualifcationDetails() {
    this.initQualDetail = this.application.activeForm.initialRegistrantQualificationDetail;
  }

  updateTrainingDetails(val) {
    this.initQualDetail.trainingDetails = val;
    this.validate();
  }

  isCVUploadRequired(): boolean {
    let eeaDirRoute = this.eeaDirectiveRouteSelected;
    if(typeof(eeaDirRoute) === 'string') eeaDirRoute = eeaDirectiveRoute[this.eeaDirectiveRouteSelected];
    return this.isEEARegulatorSelected && (eeaDirRoute === eeaDirectiveRoute.Article23);
  }

  getCountries() {
    this.accountService.getCountries().subscribe(countries => this.countriesList = countries);
  }

  setCourseName(id) {
    let qualification;
    if(this.registrationRouteSwitchValue === 'UK'){
      qualification = this.otherThanOSPAPQualifications.filter(qual => qual.id === id);
      this.initQualDetail.ukPharmacistQualificationDetail.courseName = qualification[0].courseName;
    }
    if(this.registrationRouteSwitchValue === "Northern Ireland") {
      qualification = this.otherThanOSPAPQualifications.filter(qual => qual.id === id);
      this.initQualDetail.irelandPharmacistQualificationDetail.courseName = qualification[0].courseName;
    }
    if(this.registrationRouteSwitchValue === 'OSPAP') {
      qualification = this.ospapQualifications.filter(qual => qual.id === id);
      this.initQualDetail.ospapPharmacistQualificationDetail.ospapCourseName = qualification[0].courseName;
    }
  }

  getIndexOfCV(arr) {
    let index = -1;
    if(arr && arr.length > 0) {
      index = arr.findIndex(item => item.type === AttachmentType.PharmcistCVForProfessionalStanding);
    }    
    return index;
  }

  updateAttachmentsList(arr) {    
    let attachment;
    let index = this.getIndexOfCV(arr);
    if(index >= 0) {
      attachment = arr.splice(index,1);
    }
    return attachment;
  }

  getRegistrationRoute() {
    let countryQualified = this.initQualDetail?.ospapPharmacistQualificationDetail?.ospapCountryQualified;

    // UK route
    if (this.registrationRoute === RegistrationRoute.UK || this.registrationRoute === RegistrationRoute.UKPlusOverseas ) {
        this.registrationRouteSwitchValue = "UK";
        /*this.setRouteDetailsNull();*/
        this.initQualDetail.ukPharmacistQualificationDetail = {
          courseName: this.initQualDetail.ukPharmacistQualificationDetail?.courseName,
          assessmentYear: this.initQualDetail.ukPharmacistQualificationDetail?.assessmentYear,
          courseId: this.initQualDetail.ukPharmacistQualificationDetail?.courseId,
          yearQualified: this.initQualDetail.ukPharmacistQualificationDetail?.yearQualified
        };
      }
      // EEA route
      else if (this.registrationRoute === RegistrationRoute.EEA) {
        this.registrationRouteSwitchValue = "EEA";
        // this.EEARegulatorSelected = this.countryFirstRecognised.includes(this.ccpsService.getRegulatorSelected()?.country);
        let eeaRoute = this.initQualDetail?.eeaPharmacistQualificationDetail?.eeaDirectiveRoute;
        //EEA Route - EEA Regulator selected
        if (this.isEEARegulatorSelected) { 
          if (this.application.activeForm.attachments.length > 0) {
            let attachment = this.application.activeForm.attachments.find( attachement => attachement.type ===  AttachmentType.PharmcistCVForProfessionalStanding);      
              if(attachment) {
                this.attachments = [attachment];
              }
          }   

          this.initQualDetail.eeaPharmacistQualificationDetail = {
            countryQualified: this.initQualDetail.eeaPharmacistQualificationDetail?.countryQualified || null,
            courseName : this.initQualDetail.eeaPharmacistQualificationDetail?.courseName || null,
            dateStarted : this.initQualDetail.eeaPharmacistQualificationDetail?.dateStarted || null,
            datePassed : this.initQualDetail.eeaPharmacistQualificationDetail?.datePassed || null,
            eeaDirectiveRoute: (typeof(eeaRoute) === 'number' ? eeaDirectiveRoute[eeaRoute] : eeaRoute) || null,
            educationTrainingDetails: null,
            countryFirstRecognized: this.initQualDetail.eeaPharmacistQualificationDetail?.countryFirstRecognized || null,
            nameOfUniversity: this.initQualDetail.eeaPharmacistQualificationDetail?.nameOfUniversity || null,
            cvUpload: this.attachments[0] || null
          };

          this.eeaDirectiveRouteSelected = this.initQualDetail.eeaPharmacistQualificationDetail.eeaDirectiveRoute;
          if(typeof(this.initQualDetail.eeaPharmacistQualificationDetail.eeaDirectiveRoute) === 'number') this.eeaDirectiveRouteSelected = eeaDirectiveRoute[this.initQualDetail.eeaPharmacistQualificationDetail.eeaDirectiveRoute];
        
        } else {
          //EEA Route - Non EEA Regulator selected
          this.initQualDetail.eeaPharmacistQualificationDetail = {
            countryQualified: this.initQualDetail.eeaPharmacistQualificationDetail?.countryQualified || null,
            dateStarted : this.initQualDetail.eeaPharmacistQualificationDetail?.dateStarted || null,
            courseName : this.initQualDetail.eeaPharmacistQualificationDetail?.courseName || null,
            datePassed : this.initQualDetail.eeaPharmacistQualificationDetail?.datePassed || null,
            countryFirstRecognized: this.initQualDetail?.eeaPharmacistQualificationDetail?.countryFirstRecognized || null,
            nameOfUniversity: this.initQualDetail.eeaPharmacistQualificationDetail?.nameOfUniversity || null,
            eeaDirectiveRoute:  (typeof(eeaRoute) === 'number' ? eeaDirectiveRoute[eeaRoute] : eeaRoute) || null,
          };
        }

      }
      // Reciprocity
      else if ((this.registrationRoute === RegistrationRoute.Legacy && this.application.personalDetails.registration.legacyRegistrationRoute === LegacyRegistrationRoute.Reciprocity)) {
        this.registrationRouteSwitchValue = 'Reciprocity';
         Object.assign(this.otherQualificationDetailsExists, this.qualificationDetailsExists);
        let ospapDetails = this.initQualDetail.ospapPharmacistQualificationDetail;
        this.initQualDetail.ospapPharmacistQualificationDetail = {
          ospapCountryQualified: ospapDetails?.ospapCountryQualified || null,
          degreeName: ospapDetails?.degreeName || null,
          universityName: ospapDetails?.universityName || null,
          yearObtained: ospapDetails?.yearObtained || null,
          ospapCourseId: ospapDetails?.ospapCourseId || null,
          ospapCourseName: ospapDetails?.ospapCourseName || null,
          ospapDateQualified: ospapDetails?.ospapDateQualified || null,
          assessmentYear: ospapDetails?.assessmentYear || null,
        };

      }
      // OSPAP
      else if (this.registrationRoute === RegistrationRoute.OSPAP || 
        (this.registrationRoute === RegistrationRoute.Legacy && this.application.personalDetails.registration.legacyRegistrationRoute === LegacyRegistrationRoute.Adjudicating)) {
      this.registrationRouteSwitchValue = 'OSPAP';
      let ospapDetails = this.initQualDetail.ospapPharmacistQualificationDetail;
        this.initQualDetail.ospapPharmacistQualificationDetail = {
          ospapCountryQualified: ospapDetails?.ospapCountryQualified || null,
          degreeName: ospapDetails?.degreeName || null,
          universityName: ospapDetails?.universityName || null,
          yearObtained: (ospapDetails?.yearObtained) || null,
          ospapCourseId: (ospapDetails?.ospapCourseId) || null,
          ospapCourseName: (ospapDetails?.ospapCourseName) || null,
          ospapDateQualified: (ospapDetails?.ospapDateQualified) || null,
          assessmentYear: (ospapDetails?.assessmentYear) || null,
        }; 

      }
      // Northern Ireland
      else if (this.registrationRoute === RegistrationRoute.NorthernIreland) {
        this.registrationRouteSwitchValue = "Northern Ireland";
      this.initQualDetail.irelandPharmacistQualificationDetail = {
        courseId: this.initQualDetail.irelandPharmacistQualificationDetail?.courseId || null,
        courseName: this.initQualDetail.irelandPharmacistQualificationDetail?.courseName || null,
        yearObtained: this.initQualDetail.irelandPharmacistQualificationDetail?.yearObtained || null,
        };
    }
  }

  isYearInvalid(year,type){
    if(this.assessmentDetailsExists) return;
    if(type==='yearQualified') {
      if(!year || (String(year).length !== 4) || (Number(year) < MIN_YEARQUALIFIED || Number(year) > this.currentYear)) {
        return `Year passed should be between ${MIN_YEARQUALIFIED} and ${this.currentYear}`; 
      }
    }

    if(type==='assessmentYear') {
      if((String(year).length > 0 && String(year).length !== 4) || (Number(year) < MIN_ASSESSMENTYEAR || Number(year) > this.currentYear)) {
        return `Assessment year should be between ${MIN_ASSESSMENTYEAR} and ${this.currentYear}`;
      }
    }

    if(type==='dateStarted' || type==='datePassed') {
      let dateType = (type === 'dateStarted') ? 'started' : 'awarded';
      if((String(year).length > 0 && String(year).length !== 4) || (Number(year) < MIN_EEAQUALIFIEDYEAR || Number(year) > this.currentYear)) {
        return `Year degree ${dateType} should be between ${MIN_EEAQUALIFIEDYEAR} and ${this.currentYear}`;
      }
    }
    return null;
  }

  enforceMax(el, route, prop) {
    el = el.target;
    
    let valueStr = String(el.value);
    
    if (el.value != "") {
      this.invalidYearFormat = false;
      if (valueStr.length > 4) el.value = Number(valueStr.slice(0,4)); 
      if(valueStr.length !==4) this.invalidYearFormat = true;
    } else this.invalidYearFormat = true;

  if(prop === 'yearQualified') {
    if(route === 'UK') this.initQualDetail.ukPharmacistQualificationDetail.yearQualified = el.value;
    if(route === 'OSPAP' || route === 'Reciprocity') this.initQualDetail.ospapPharmacistQualificationDetail.yearObtained = el.value;
    if(route === 'Northern Ireland') this.initQualDetail.irelandPharmacistQualificationDetail.yearObtained = el.value;
  }
  if(prop === 'assessmentYear') {
    if(route === 'UK') this.initQualDetail.ukPharmacistQualificationDetail.assessmentYear = el.value;
    if(route === 'OSPAP') this.initQualDetail.ospapPharmacistQualificationDetail.assessmentYear = el.value;
  }
  if(prop === 'dateStarted') this.initQualDetail.eeaPharmacistQualificationDetail.dateStarted = el.value;
  if(prop === 'datePassed') this.initQualDetail.eeaPharmacistQualificationDetail.datePassed = el.value;
  this.validate();
}

  setRouteDetailsNull() {
    this.initQualDetail.irelandPharmacistQualificationDetail = null;
    this.initQualDetail.pharmacyTechnicianQualificationDetail = null;
    this.initQualDetail.ukPharmacistQualificationDetail = null;
    this.initQualDetail.eeaPharmacistQualificationDetail = null;
    this.initQualDetail.ospapPharmacistQualificationDetail = null;
  }

  checkIfInValid(value) {
    return value === '' || !value;
  }

  populateForm() {
    if(this.registrationRouteSwitchValue && this.registrationRouteSwitchValue === 'EEA') {
      if(!this.isEEARegulatorSelected) {
        this.initQualDetail.eeaPharmacistQualificationDetail.cvUpload = null;
        this.onDocDelete();
      } else {
        if(!this.isCVUploadRequired()) {
          this.initQualDetail.eeaPharmacistQualificationDetail.cvUpload = null;
          this.onDocDelete();
        }
      }
    }
  }

  onDocUpload($event) {
    this.attachments = $event;
    this.attachments.forEach(attachment => {
      attachment.type = this.attachmentType;
    });
    this.deleteUrl = this.DELETE_URL;
    this.validate();
  }

  onDocDelete() {
    this.deleteUrl = '';
    this.updateAttachmentsList(this.attachments);
    this.updateAttachmentsList(this.application.activeForm.attachments);
    this.validate();
  }

  get checkIfTrainingDetailsExists() {
    return !!(this.initQualDetail.trainingDetails && this.initQualDetail.trainingDetails?.length > 0);
  }

  get isPTDetailsEntered(){
    if(this.registrationRoute === RegistrationRoute.EEA) return;
    let firstQualDetails = this.initQualDetail.pharmacyTechnicianQualificationDetail.degreeName1 && this.initQualDetail.pharmacyTechnicianQualificationDetail.qualifiedDate1;
    let secQualDetails = this.initQualDetail.pharmacyTechnicianQualificationDetail.degreeName2 && this.initQualDetail.pharmacyTechnicianQualificationDetail.qualifiedDate2;
    return firstQualDetails || secQualDetails;
  }
 
  onDateSelection(type, date) {
    if(type === 'qualifiedDate1')this.initQualDetail.pharmacyTechnicianQualificationDetail.qualifiedDate1 = date;
    if(type === 'qualifiedDate2')this.initQualDetail.pharmacyTechnicianQualificationDetail.qualifiedDate2 = date;
    this.validate();
  }

  onEEADirectiveRouteSelect() {
    this.initQualDetail.eeaPharmacistQualificationDetail.eeaDirectiveRoute = eeaDirectiveRoute[this.eeaDirectiveRouteSelected]
  }

  validate() {
    let messages = []; let valid =true;

    if (!this.isPharmacist) {
      
      if(this.registrationRoute === RegistrationRoute.EEA) {
        if(this.initQualDetail.eeaPharmacistQualificationDetail) {
          if(!this.initQualDetail.eeaPharmacistQualificationDetail.courseName) messages.push('Please enter the course name')
          if(!this.initQualDetail.eeaPharmacistQualificationDetail.countryQualified) messages.push('Please select the country')
          if(this.isYearInvalid(this.initQualDetail.eeaPharmacistQualificationDetail.datePassed,'datePassed')) messages.push(this.isYearInvalid(this.initQualDetail.eeaPharmacistQualificationDetail.datePassed,'datePassed'));
        }
      } else {
        if (!this.isPTDetailsEntered) messages.push('Please provide atleast one qualification details');

        if(this.initQualDetail.pharmacyTechnicianQualificationDetail?.degreeName1?.length > 200 ||
          this.initQualDetail.pharmacyTechnicianQualificationDetail?.degreeName2?.length > 200) messages.push('Qualification can be of maximum 200 characters');
      }
    }
    if (this.registrationRouteSwitchValue === 'UK') {


      if((!this.qualificationDetailsExists.courseExists && this.checkIfInValid(this.initQualDetail.ukPharmacistQualificationDetail?.courseId)) ||
      (!this.qualificationDetailsExists.qualifiedExists && (this.checkIfInValid(this.initQualDetail.ukPharmacistQualificationDetail?.yearQualified) ||
      (this.isYearInvalid(this.initQualDetail.ukPharmacistQualificationDetail?.yearQualified, 'yearQualified'))))){
        messages.push('Please provide education details');
      }

      if(this.trainingDetailsComp && (this.trainingDetailsComp.getTrainingRowEditable === 0 || this.trainingDetailsComp.getTrainingRowEditable >0)) messages.push('Please save the training details');

      if(!this.assessmentDetailsExists && this.initQualDetail.ukPharmacistQualificationDetail?.assessmentYear) if (this.isYearInvalid(this.initQualDetail.ukPharmacistQualificationDetail?.assessmentYear,'assessmentYear')) messages.push(this.isYearInvalid(this.initQualDetail.ukPharmacistQualificationDetail?.assessmentYear,'assessmentYear'));
    }
    if (this.registrationRouteSwitchValue === 'EEA') {
      if(!this.initQualDetail.eeaPharmacistQualificationDetail.nameOfUniversity) messages.push('Please provide the university/awarding body name');
      if (this.isEEARegulatorSelected) {
        if (!this.initQualDetail.eeaPharmacistQualificationDetail.countryQualified) messages.push('Please select the country');
        if (!this.initQualDetail.eeaPharmacistQualificationDetail.eeaDirectiveRoute) messages.push('Please select the EEA directive route');
        if(!this.initQualDetail.eeaPharmacistQualificationDetail.courseName || !this.initQualDetail.eeaPharmacistQualificationDetail.datePassed ||
          !this.initQualDetail.eeaPharmacistQualificationDetail.dateStarted) messages.push('Please provide the course details');
        if(this.initQualDetail.eeaPharmacistQualificationDetail.dateStarted && this.isYearInvalid(this.initQualDetail.eeaPharmacistQualificationDetail.dateStarted,'dateStarted')) messages.push(this.isYearInvalid(this.initQualDetail.eeaPharmacistQualificationDetail.dateStarted,'dateStarted'));
        if(this.initQualDetail.eeaPharmacistQualificationDetail.datePassed && this.isYearInvalid(this.initQualDetail.eeaPharmacistQualificationDetail.datePassed,'datePassed')) messages.push(this.isYearInvalid(this.initQualDetail.eeaPharmacistQualificationDetail.datePassed,'datePassed'));
        if (this.isCVUploadRequired()) {
          let attachment = this.updateAttachmentsList(this.application.activeForm.attachments);
          attachment = this.application.activeForm.attachments.find( attachement => attachement.type ===  AttachmentType.PharmcistCVForProfessionalStanding);      
          
          if(this.attachments.length > 0 && !attachment) {
            this.application.activeForm.attachments.push(this.attachments[0]);
          }
          if (!this.attachments || (this.attachments && this.attachments?.length === 0)) messages.push('Please upload your CV');
          if (this.docService.validate()?.length > 0) messages.push([...this.docService.validate()])
        }

      } else {
        if (!this.qualificationDetailsExists.countryExists && !this.initQualDetail.eeaPharmacistQualificationDetail.countryQualified) messages.push('Please select the country in which pharmacy qualification was obtained');
        //if (!this.initQualDetail.eeaPharmacistQualificationDetail.countryFirstRecognized) messages.push('Please select the country of first recognition within the EEA');
        if(!this.initQualDetail.eeaPharmacistQualificationDetail.courseName || !this.initQualDetail.eeaPharmacistQualificationDetail.datePassed) messages.push('Please provide the course details');
      }
      if(this.initQualDetail.eeaPharmacistQualificationDetail?.courseName?.length > 200) messages.push('Qualification can be of maximum 200 characters');
      if(this.initQualDetail.eeaPharmacistQualificationDetail?.nameOfUniversity?.length > 2000 ) messages.push('Name of university or awarding body can be of maximum 2000 characters');
    }

    if (this.registrationRouteSwitchValue === 'OSPAP' || this.registrationRouteSwitchValue === 'Reciprocity') {
      let isEducationDetailsValid = true;
      
      if(this.registrationRouteSwitchValue === 'OSPAP') {
        if(!this.qualificationDetailsExists.countryExists && !this.initQualDetail.ospapPharmacistQualificationDetail.ospapCountryQualified) messages.push('Please enter the country in which degree obtained');
        if(!this.qualificationDetailsExists.courseExists) isEducationDetailsValid = isEducationDetailsValid && !!this.initQualDetail.ospapPharmacistQualificationDetail.ospapCourseId;
        if(!this.qualificationDetailsExists.qualifiedExists) isEducationDetailsValid = isEducationDetailsValid && !!this.initQualDetail.ospapPharmacistQualificationDetail.ospapDateQualified;
        if(!isEducationDetailsValid) messages.push('Please enter all the OSPAP qualification details');
        if(this.initQualDetail.ospapPharmacistQualificationDetail?.yearObtained && this.isYearInvalid(this.initQualDetail.ospapPharmacistQualificationDetail?.yearObtained,'yearQualified')) {if(messages.length < 3) messages.push('Please enter a valid year'); else valid = false;}
      }

      if(this.registrationRouteSwitchValue === 'Reciprocity') {
        isEducationDetailsValid = !!this.initQualDetail.ospapPharmacistQualificationDetail.degreeName;
        if(!this.qualificationDetailsExists.countryExists) isEducationDetailsValid = isEducationDetailsValid && !!this.initQualDetail.ospapPharmacistQualificationDetail.ospapCountryQualified;
        isEducationDetailsValid = isEducationDetailsValid && (!!this.initQualDetail.ospapPharmacistQualificationDetail.yearObtained && !this.isYearInvalid(this.initQualDetail.ospapPharmacistQualificationDetail.yearObtained,'yearQualified'));
        if(!isEducationDetailsValid) messages.push('Please enter all the qualification details');
      }

      if(isEducationDetailsValid) if(this.initQualDetail.ospapPharmacistQualificationDetail?.degreeName?.length > 200) messages.push('Degree can be of maximum 200 characters');

      if (!this.assessmentDetailsExists && this.initQualDetail.ospapPharmacistQualificationDetail.assessmentYear && this.registrationRouteSwitchValue === 'OSPAP' && this.isYearInvalid(this.initQualDetail.ospapPharmacistQualificationDetail.assessmentYear,'assessmentYear')) messages.push(this.isYearInvalid(this.initQualDetail.ospapPharmacistQualificationDetail.assessmentYear,'assessmentYear'));

      if (!this.trainingDetailsExists) if(this.trainingDetailsComp && (this.trainingDetailsComp.getTrainingRowEditable === 0 || this.trainingDetailsComp.getTrainingRowEditable >0)) messages.push('Please save the training details');

      if(this.initQualDetail.ospapPharmacistQualificationDetail?.degreeName && 
        this.initQualDetail.ospapPharmacistQualificationDetail?.degreeName?.length > 500) messages.push('Qualification can be of maximum 200 characters');

      if(this.initQualDetail.ospapPharmacistQualificationDetail?.universityName && 
        this.initQualDetail.ospapPharmacistQualificationDetail?.universityName?.length > 1000) messages.push('University can be of maximum 1000 characters');
    }

    if (this.registrationRouteSwitchValue === 'Northern Ireland') {
      if (!this.qualificationDetailsExists.courseExists) if (this.checkIfInValid(this.initQualDetail.irelandPharmacistQualificationDetail?.courseId)) messages.push('Please enter the degree')
      if(!this.qualificationDetailsExists.qualifiedExists) if (this.checkIfInValid(this.initQualDetail.irelandPharmacistQualificationDetail?.yearObtained) || this.isYearInvalid(this.initQualDetail.irelandPharmacistQualificationDetail?.yearObtained,'yearQualified')) messages.push('Please enter year passed')
    }

    valid = valid && !messages.length;
    this.validity$.next({ valid: valid, messages: messages, touched: this.touched });
  }
}
