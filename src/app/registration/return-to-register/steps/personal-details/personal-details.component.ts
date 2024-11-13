import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { ReturnToRegisterStep } from '../../model/ReturnToRegisterStep';
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
import { ReturnToRegisterDetails } from '../../model/ReturnToRegisterDetails';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => PersonalDetailsComponent)
    },
    SupportingDocumentsService,
  ]
})
export class PersonalDetailsComponent extends FormStepComponent implements OnInit, AfterViewInit {
  title = 'Personal details';
  @Input() stepId = ReturnToRegisterStep.PersonalDetails;
  @Input() readonly = false;
  @Input() touched = false;
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
  @Input() application;
  @ViewChild('form') form: NgForm;
  @Output() navigate = new EventEmitter<number>();
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };
  uploadType = UploadType.ReturnToRegisterSupportingDocuments;
  sessionId = utils.guid();
  attachments: { [key: number]: Array<FileUpload> } = {};
  AttachmentType = AttachmentType;
  registrantDetails: ReturnToRegisterDetails;
  deleteUrl;
  registrant: Applicant;
  officialDocumentForNameChange;
  registeredDocTypes = [];
  docTypes = 2;
  titleError:boolean=false
  salutations: Array<{ key: string; value: number }> = [];
  titleName;
  @ViewChild('salutationInput') salutationRef: ElementRef;
  salutation: FormControl<string | null> = new FormControl();
  filteredSalutations: Observable<any[]>;
  constructor(service: FormStepperService, private auth: AuthService, private docService: SupportingDocumentsService,
    private dialog: MatDialog, private accountService: AccountService) {
    super(service);
  }


  @ViewChild('contact') contact: ContactEditComponent;
  ngOnInit() {
    this.user = this.auth.user;
    this.applicant = this.application;
    this.registrantDetails = this.applicant.activeForm.returnToRegisterDetail;
    console.log(this.registrantDetails);
    if (this.user) {
      this.registrantFullName = [this.user.title,this.user.forenames, this.user.middleName, this.user.surname].filter(Boolean).join(' ');
    }
    if (this.application.activeForm.attachments.length > 0) {
      let attachment = this.application.activeForm.attachments.find( attachement => attachement.type ===  AttachmentType.OfficialDocummentConfirmingNameChange);      
        if(attachment) {
          this.attachments[AttachmentType.OfficialDocummentConfirmingNameChange] = [attachment];
        }
    }    
    if(this.registrantDetails.title && this.registrantDetails.title.name) {
      this.salutation.setValue(this.registrantDetails.title.name);
      this.titleName = this.registrantDetails.title.name;
    }
    this.loadSalutations();
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
          if (newValue.name !== this.registrantDetails.title.name) {
            this.registrantDetails.title = newValue;
            this.propagateChange(this.registrantDetails);
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
  ngAfterViewInit() {
    setTimeout(() => {
      this.ready$.next(true);
      this.viewReady = true;
    });
  }

  update() {
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
    if(this.application.activeForm.attachments && this.application.activeForm.attachments.length > 0) {
      index = this.application.activeForm.attachments.findIndex(item => item.type === AttachmentType.OfficialDocummentConfirmingNameChange);
    }    
    return index;
  }

  updateApplication() {    
    let index = this.getIndexOfDocummentConfirmingNameChange;
    if(index >= 0) {
      this.application.activeForm.attachments.splice(index,1);
    }
    if(this.attachments[AttachmentType.OfficialDocummentConfirmingNameChange].length > 0) {
      this.application.activeForm.attachments.push(this.attachments[AttachmentType.OfficialDocummentConfirmingNameChange][0]);
    }
    this.validate();
    this.makeDirty();
  }

  onTitleChange(event) {
    let selected, value;
    this.titleError=false;
    if(event.target.value && event.target.value.trim().length > 0) {
      selected = this.salutations.filter(item =>item.key.toLowerCase() == event.target.value.toLowerCase());  
      selected.length > 0 ? value = { name: selected[0].key, id: selected[0].value } : this.titleError=true;
    } else {
      value = { name: '', id: '' };
    }    
    this.registrantDetails.title = value;
    this.propagate();
  }

  updateAttachment() {
    if(this.registrantDetails.confirmUserNameChange) {
      if(this.getIndexOfDocummentConfirmingNameChange >= 0) {
        this.attachments = [];
        this.application.activeForm.attachments.splice(this.getIndexOfDocummentConfirmingNameChange,1);
      }
    }
  }

  validate() {
    const messages = [];
    const confirmNameChange = this.registrantDetails.confirmUserNameChange;
    this.hasTitle = !!this.registrantDetails.title && !!this.registrantDetails.title.name && !!this.registrantDetails.title.name.trim().length;
    this.hasNewName = !!this.registrantDetails.forenames && !!this.registrantDetails.surname;
  
    if(confirmNameChange === null || confirmNameChange === undefined) {
      messages.push('Please confirm the name you wish to register with');
    }

    if (confirmNameChange === false) {

      if (this.hasTitle === null || this.hasTitle === false) {
        messages.push('You haven\'t entered a title');
      }
      if (this.hasNewName === null || this.hasNewName === false ) {
        messages.push('You haven\'t entered changed name');
      }
      
      if (this.docService.validate().length) {
        messages.push(this.docService.validate());
      } else {
        if(this.registrantDetails.confirmUserNameChange === false && this.getIndexOfDocummentConfirmingNameChange < 0) {
          messages.push("You haven't uploaded your image of official document confirming name change");
        }
      }
    }

    this.validity$.next({ valid: messages.length==0, messages, touched: this.touched });
  }

  propagate() {
    this.validate();
  }
  populateForm() {
    this.updateAttachment();
   }
}
