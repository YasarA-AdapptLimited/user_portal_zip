import { Input, Component, OnInit, EventEmitter, Output } from "@angular/core";
import { FormStepperService } from "../../../../../app/shared/formStepper/formStepper.service";
import { AuthService } from "../../../../core/service/auth.service";
import { CCPSService } from "../../../../core/service/ccps.service";
import { AccountService } from '../../../../account/service/account.service';
import { RegistrantType } from "../../../model/RegistrantType";
import { CCPSApplication } from "../../model/ccpsApplication";
import { CCPSApplicationStep } from "../../model/ccpsApplicationStep";
import { RegistrantPersonalDetails, RegistrationRoute } from "../../model/CCPSDetails";
import { EEACountries, eeaDirectiveRoute, LegacyRegistrationRoute } from "../../model/initialPharmacyQualificationDetail";
import { ProfessionalStandingDetail } from "../../model/professionalStandingDetail";
import { AttachmentType } from "../../../../shared/model/AttachmentType";
import { RegistrantStatus } from "../../../model/RegistrantStatus";
@Component({
  selector: "app-ccps-application-review",
  templateUrl: "./ccpsApplicationReview.component.html",
  styleUrls: ["./ccpsApplicationReview.scss"],
})
export class CcpsApplicationReviewComponent implements OnInit {
  title = "Review";
  stepId = CCPSApplicationStep.Review;

  user;
  applicant;
  @Input() application: CCPSApplication;
  @Input() readonly = false;
  @Input() showEdi = true;
  @Input() formId;
  @Input() pastApplication = false;
  @Input() displayFtPStep : boolean = false;
  initialPharmacyQualificationDetailHeading = {
    education: "Education",
    training: "Pre-registration training/foundation training",
    assessment: "Registration assessment",
  };

  professionalStandingDetail: ProfessionalStandingDetail;
  personalDetails: RegistrantPersonalDetails
  registrantFullName: string;
  nameChangeForename: string;
  nameChangeTitle: string;
  nameChangeMiddleNames: string;
  nameChangeSurname: string;
  countryQualified: string;
  degreeName: string;
  universityName: string;
  yearObtained: number;
  ospapDegreeName: string;
  ospapDateQualified: string;
  assessmentName: string;
  degreeName1: string;
  qualifiedDate1: Date;
  degreeName2: string;
  qualifiedDate2: Date;
  continueExistingName: string;
  nameTitle: string;
  overseasRegulatoryDetais = {
    country: "country1",
    regulatoryBody: "regulatory body",
    pinCode: "pin code",
    address: "address",
  };
  initQualDetails;
  ccpsApplicationStep: any;
  regulatoryBodyName: any;
  isPharmacist = false;
  userRoute;
  registrationRoute: RegistrationRoute;
  EEACountriesList = EEACountries;
  attachments = [];
  downloading = false;
  nationalities = [];
  selectedNationality: string;
  attachmentType = AttachmentType;
  registration;
  registrationStatus;
  regBodyEmailAddress;
  
  constructor(formStpperService: FormStepperService, private auth: AuthService, private ccpsService: CCPSService, private accountService: AccountService) { }
  @Output() navigate = new EventEmitter<number>();
  ngOnInit() {
    this.initQualDetails = this.application.activeForm.initialRegistrantQualificationDetail;

    this.attachments = this.application.activeForm.attachments;

    this.isPharmacist = this.auth.user.registrant.type === RegistrantType.Pharmacist;

    if(this.isPharmacist) this.setUserRoute();

    this.professionalStandingDetail =
      this.application.activeForm.professionalStandingDetail;
    this.application.regulatoryBodies.forEach((rb) => {
      if (
        this.application.activeForm.professionalStandingDetail
          .regulatoryBodyId === rb.id
      ) {
        this.regulatoryBodyName = rb.name;
        this.regBodyEmailAddress = rb.standardEmail;

      }
    });

    this.personalDetails = this.application.personalDetails;

    if (this.personalDetails) {
      this.nameTitle = this.personalDetails?.title?.name || '-';
      this.registrantFullName = this.nameTitle + ' ' + [this.personalDetails.forenames, this.personalDetails.middleName, this.personalDetails.surname].filter(Boolean).join(' ');
      this.continueExistingName = this.professionalStandingDetail.continueExistingName === true ? 'Yes': (this.professionalStandingDetail.continueExistingName === false ? 'No' : '-');
      this.nameChangeTitle = this.professionalStandingDetail?.title?.name || '-';
      this.nameChangeForename = this.professionalStandingDetail.forenames;
      this.nameChangeMiddleNames = this.professionalStandingDetail.middleName;
      this.nameChangeSurname = this.professionalStandingDetail.surname;
      this.registration = this.personalDetails.registration;
      this.registrationStatus = RegistrantStatus[this.registration.registrationStatus];
    }

    this.ccpsApplicationStep = CCPSApplicationStep;

    this.loadNationalitiesAndSet();
  }

  get route(){
    if(this.application.personalDetails.registration.registrationRoute)return RegistrationRoute[this.application.personalDetails.registration.registrationRoute];
  }

  loadNationalitiesAndSet() {
    this.accountService.getEdiOptions().subscribe(data => {
      this.nationalities = data.sections.find(section => section.name === 'Nationality').groups;

      const filterById = this.application.activeForm.equalityDiversity.nationality;
      const filteredItem = this.nationalities.find((item) => item.id === filterById);
  
      if (filteredItem) {
        this.selectedNationality = filteredItem.name;
      }
    });
  }

  get directiveRouteEEA() {
    if(this.initQualDetails.eeaPharmacistQualificationDetail?.eeaDirectiveRoute) {
      if(typeof(this.initQualDetails.eeaPharmacistQualificationDetail?.eeaDirectiveRoute) === 'number') return eeaDirectiveRoute[this.initQualDetails.eeaPharmacistQualificationDetail.eeaDirectiveRoute];
      else return this.initQualDetails.eeaPharmacistQualificationDetail.eeaDirectiveRoute;
    } else return '-';
  }

  isCVUploadRequired(): boolean {
    let eeaRoute;
    if(this.initQualDetails.eeaPharmacistQualificationDetail?.eeaDirectiveRoute) {
      eeaRoute = this.initQualDetails.eeaPharmacistQualificationDetail.eeaDirectiveRoute;
      if(typeof(this.initQualDetails.eeaPharmacistQualificationDetail?.eeaDirectiveRoute) === 'string') eeaRoute = eeaDirectiveRoute[this.initQualDetails.eeaPharmacistQualificationDetail?.eeaDirectiveRoute];
    }

    return this.isEEARegulatorSelected && (eeaRoute === eeaDirectiveRoute.Article23);
  }

  get isEEARegulatorSelected() {
    const EEARegulatorSelected = this.EEACountriesList.includes(this.application.activeForm.professionalStandingDetail.country);
    return EEARegulatorSelected;
  }

  setUserRoute() {
    let countryQualified = this.application?.activeForm?.initialRegistrantQualificationDetail?.ospapPharmacistQualificationDetail?.ospapCountryQualified;
    this.registrationRoute = this.application.personalDetails.registration.registrationRoute;
    
    if (this.registrationRoute === RegistrationRoute.UK) {
      this.userRoute = "UK";      
    }
    // EEA route
    else if (this.registrationRoute === RegistrationRoute.EEA) {
      this.userRoute = "EEA";
    }
    // Reciprocity
    else if ((this.registrationRoute === RegistrationRoute.Legacy && this.application.personalDetails.registration.legacyRegistrationRoute === LegacyRegistrationRoute.Reciprocity) ||
      (this.registrationRoute === RegistrationRoute.OSPAP && this.application.activeForm.qualificationDetailsExists?.countryExists && (countryQualified === 'Australia' || countryQualified === 'New Zealand' || countryQualified === 'South Africa'))) {
      this.userRoute = 'Reciprocity';
    }
    // OSPAP
    else if (this.registrationRoute === RegistrationRoute.OSPAP || 
      (this.registrationRoute === RegistrationRoute.Legacy && this.application.personalDetails.registration.legacyRegistrationRoute === LegacyRegistrationRoute.Adjudicating)) {
    this.userRoute = 'OSPAP';
    }
    // Northern Ireland
    else if (this.registrationRoute === RegistrationRoute.NorthernIreland) {
      this.userRoute = "Northern Ireland";
    }
  }

  download(file) {
    this.downloading = true;
    this.ccpsService.getDoc(file).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const element = document.createElement('a');
      element.href = url;
      element.setAttribute('download', file.filename);
      document.body.appendChild(element); // Append the element to work in firefox
      element.click();

    });
  }

  validate() {
    //throw new Error('Method not implemented.');
  }
  populateForm() {
    //throw new Error('Method not implemented.');
  }

  goToStep(stepId) {
    this.navigate.emit(stepId);
  }
}
