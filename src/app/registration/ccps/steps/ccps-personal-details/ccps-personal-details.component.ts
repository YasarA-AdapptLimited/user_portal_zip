import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { CCPSApplicationStep } from '../../model/ccpsApplicationStep';
import { Tooltip } from '../../../../core/tooltip/Tooltip';
import { Applicant } from '../../../../account/model/Applicant';
import { ContactEditComponent } from '../../../../account/contactEdit.component';
import { AuthService } from '../../../../core/service/auth.service';
import { SupportingDocumentsService } from '../../../../shared/supportingDocuments/supportingDocuments.service';
import { UploadType } from '../../../../shared/model/UploadType';
import { FileUpload } from '../../../../shared/model/FileUpload';
import { AttachmentType } from '../../../../shared/model/AttachmentType';
import utils from '../../../../shared/service/utils';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from '../../../../account/service/account.service';
import { map, startWith } from 'rxjs/operators';
import { RegistrantPersonalDetails, RegistrationDetails } from '../../model/CCPSDetails';
import { CCPSApplication } from '../../model/ccpsApplication';
import { ProfessionalStandingDetail } from '../../model/professionalStandingDetail';

@Component({
  selector: 'app-ccps-personal-details',
  templateUrl: './ccps-personal-details.component.html',
  styleUrls: ['./ccps-personal-details.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => CCPSPersonalDetailsComponent)
    },
    SupportingDocumentsService,
  ]
})
export class CCPSPersonalDetailsComponent extends FormStepComponent implements OnInit, AfterViewInit {
  title = 'Personal details';
  @Input() stepId = CCPSApplicationStep.PersonalDetails;
  @Input() readonly = false;
  @Input() touched = false;
  @Input() application: CCPSApplication;
  @Output() navigate = new EventEmitter<number>();
  @ViewChild('form') form: NgForm;
  @ViewChild('salutationInput') salutationRef: ElementRef;
  @ViewChild('contact') contact: ContactEditComponent;
  viewReady = false;
  showDetailsHelp = false;
  showContactHelp = false;
  applicant;
  contactValid;
  hasNewName;
  hasTitle;
  hasNationality;
  selection;
  registrantFullName;
  user;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };
  uploadType = UploadType.ProfessionalStandingSupportingDocuments;
  sessionId = utils.guid();
  attachments: { [key: number]: Array<FileUpload> } = {};
  AttachmentType = AttachmentType;
  deleteUrl;
  registrant: Applicant;
  registrantDetails: RegistrantPersonalDetails;
  registrationDetails: RegistrationDetails;
  officialDocumentForNameChange;
  registeredDocTypes = [];
  docTypes = 2;
  titleError: boolean = false
  salutations: Array<{ key: string; value: number }> = [];
  titleName;
  salutation: FormControl<string | null> = new FormControl();
  filteredSalutations: Observable<any[]>;
  nationalities = [];
  nationality;
  zero = 0;
  professionalStandingDetail: ProfessionalStandingDetail;
  
  constructor(
    service: FormStepperService,
    private auth: AuthService, 
    private docService: SupportingDocumentsService,
    private dialog: MatDialog,
    private accountService: AccountService) 
  {
    super(service);
  }

  ngOnInit() {
    this.user = this.auth.user;
    this.applicant = this.application;
    this.registrantDetails = this.applicant.personalDetails;

    this.professionalStandingDetail = this.application.activeForm.professionalStandingDetail;

    if (this.user) {
      this.registrantFullName = [this.user.title, this.user.forenames, this.user.middleName, this.user.surname].filter(Boolean).join(' ');
    }

    if (this.application.activeForm.attachments.length > 0) {
      let attachment = this.application.activeForm.attachments.find(attachement => attachement.type === AttachmentType.OfficialDocummentConfirmingNameChange);
      if (attachment) {
        this.attachments[AttachmentType.OfficialDocummentConfirmingNameChange] = [attachment];
      }
    }

    if (this.professionalStandingDetail.title && this.professionalStandingDetail.title.name) {
      this.salutation.setValue(this.professionalStandingDetail.title.name);
      this.titleName = this.professionalStandingDetail.title.name;
    }

    this.loadSalutations();
    this.loadNationalities();
  }

  load() {
    if (this.viewReady) {
      this.ready$.next(true);
    }
  }

  loadSalutations() {
    this.accountService.getSalutations().subscribe(data => {
      for (const key in data) {
        this.salutations.push({ key, value: data[key] });
      }
      this.filteredSalutations = this.salutation.valueChanges
        .pipe(
          startWith(''),
          map(val => this.filter(val))
        );

      this.salutation.valueChanges.subscribe(value => {
        if (!value) {
          return false;
        } else {
          const selected = this.salutations.filter(item => item.key.toLowerCase() === value.toLowerCase());

          let newValue = { name: value, id: 981360000 };
          if (selected.length) {
            newValue = { name: selected[0].key, id: selected[0].value };
          }
          if (newValue.name !== this.professionalStandingDetail.title.name) {
            this.professionalStandingDetail.title = newValue;
            this.propagateChange(this.professionalStandingDetail);
          }
        }
      });
    });
  }

  filter(val: string): { key: string; value: number }[] {
    return this.salutations.filter(option =>
      option.key.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  propagateChange = (model: any) => { };
  
  loadNationalities() {
    this.accountService.getEdiOptions().subscribe(data => {
      this.nationalities = data.sections.find(section => section.name === 'Nationality').groups;

      // pre-populate nationality if set in CRM
      this.nationality = this.applicant.activeForm.equalityDiversity.nationality;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ready$.next(true);
      this.viewReady = true;
    });
  }

  update() {
    this.propagateChange(this.professionalStandingDetail.continueExistingName);

    this.makeDirty();
    this.validate();
  }

  onRegistered(type: AttachmentType) {
    this.registeredDocTypes.push(type);
    if (this.registeredDocTypes.length === this.docTypes) {
      setTimeout(() => {
        this.viewReady = true;
        this.ready$.next(true);
      });
    }
  }

  onUploaded($event) {
    this.attachments[$event.type] = $event.uploads;
    $event.uploads.forEach(upload => upload.type = $event.type);
    this.updateApplication();
  }

  get getIndexOfDocummentConfirmingNameChange() {
    let index = -1;
    if (this.application.activeForm.attachments && this.application.activeForm.attachments.length > 0) {
      index = this.application.activeForm.attachments.findIndex(item => item.type === AttachmentType.OfficialDocummentConfirmingNameChange);
    }
    return index;
  }

  updateApplication() {
    let index = this.getIndexOfDocummentConfirmingNameChange;
    if (index >= 0) {
      this.application.activeForm.attachments.splice(index, 1);
    }
    if (this.attachments[AttachmentType.OfficialDocummentConfirmingNameChange].length > 0) {
      this.application.activeForm.attachments.push(this.attachments[AttachmentType.OfficialDocummentConfirmingNameChange][0]);
    }
    this.validate();
    this.makeDirty();
  }

  onTitleChange(event) {
    let selected, value;
    this.titleError = false;
    if (event.target.value && event.target.value.trim().length > 0) {
      selected = this.salutations.filter(item => item.key.toLowerCase() == event.target.value.toLowerCase());
      selected.length > 0 ? value = { name: selected[0].key, id: selected[0].value } : this.titleError = true;
    } else {
      value = { name: '', id: '' };
    }
    this.professionalStandingDetail.title = value;
    this.propagate();
  }

  updateAttachment() {
    if(this.professionalStandingDetail.continueExistingName) {
      if(this.getIndexOfDocummentConfirmingNameChange >= 0) {
        this.attachments = [];
        this.application.activeForm.attachments.splice(this.getIndexOfDocummentConfirmingNameChange,1);
      }
    }
  }

  validate() {
    const messages = [];
    const continueExistingName = this.professionalStandingDetail.continueExistingName;
    
    this.hasTitle = !!this.professionalStandingDetail.title && !!this.professionalStandingDetail.title.name && !!this.professionalStandingDetail.title.name.trim().length;
    this.hasNewName = !!this.professionalStandingDetail.forenames && !!this.professionalStandingDetail.surname;
  
    if(continueExistingName === null || continueExistingName === undefined) {
      messages.push('Please confirm the name you wish to register with');
    }

    if (continueExistingName === false) {

      if (this.hasTitle === null || this.hasTitle === false) {
        messages.push('You haven\'t entered a title');
      }
      if (this.hasNewName === null || this.hasNewName === false ) {
        messages.push('You haven\'t entered changed name');
      }
      
      if (this.docService.validate().length) {
        messages.push(this.docService.validate());
      } else {
        if(this.professionalStandingDetail.continueExistingName === false && this.getIndexOfDocummentConfirmingNameChange < 0) {
          messages.push("You haven't uploaded your image of official document confirming name change");
        }
      }
    }
    
    this.applicant.activeForm.equalityDiversity.nationality = parseInt(<any>(this.applicant.activeForm.equalityDiversity.nationality), 10);

    this.hasNationality = !!this.applicant.activeForm.equalityDiversity.nationality;
    if (!this.hasNationality) {
      messages.push('You haven\'t selected your nationality');
    }

    this.validity$.next({ valid: messages.length == 0, messages, touched: this.touched });
  }

  propagate() {
    this.validate();
  }
  
  populateForm() { 
    this.updateAttachment();
    if(this.professionalStandingDetail.continueExistingName === true) {
      this.professionalStandingDetail.forenames = null;
      this.professionalStandingDetail.surname = null;
      this.professionalStandingDetail.middleName = null;
    }
  }
}
