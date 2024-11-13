import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { IndependentPrescriberApplicationStep } from '../../model/IndependentPrescriberApplicationStep';
import { UploadType } from '../../../../shared/model/UploadType';
import utils from '../../../../shared/service/utils';
import { SupportingDocumentsService } from '../../../../shared/supportingDocuments/supportingDocuments.service';
import { FileUpload } from '../../../../shared/model/FileUpload';
import { NgForm } from '@angular/forms';
import { AttachmentType } from '../../../../shared/model/AttachmentType';
import { ApplicationStatus } from '../../../../prereg/model/ApplicationStatus';
import { Countersignature } from '../../model/IndependentPrescriberForm';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirmDialog.component';
import { Tooltip } from '../../../../core/tooltip/Tooltip';

const UKRegulators = [
  'General Medical Council (Doctors)',
  'Nursing and Midwifery Council (Nurses)',
  'Health and Care Professions Council (Physotherapists)',
  'Health and Care Professions Council (Therapeutic radiographers)',
  'Health and Care Professions Council (Podiatrists)',
  'Health and Care Professions Council (Paramedics)',
  'General Optical Council (Optometrists)'
];

@Component({
  selector: 'app-qualification-step',
  templateUrl: './qualification-step.component.html',
  providers: [
    SupportingDocumentsService,
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => QualificationStepComponent)
    }
  ],
  styleUrls: ['./qualification-step.component.scss']
})
export class QualificationStepComponent extends FormStepComponent implements OnInit {
  
  @Input() application;
  @ViewChild('form') form: NgForm;

  title = 'Qualification Details';
  stepId = IndependentPrescriberApplicationStep.QualificationDetails;
  applicant;
  isDateBeyondSixMonths = false;
  prescriberMentorNotRegistered;
  uploadType = UploadType.InpendentPrescriberSupportDocuments;
  sessionId = utils.guid();
  attachments: { [key: number]: Array<FileUpload> } = {};
  AttachmentType = AttachmentType;
  attachmentType = AttachmentType.IndyPrescriberMentorConfirmation;
  regulators;
  applicantFormDetails;
  nextStepClicked = false;

  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };

  /**
   * below two changes has to be made, to display 'are you sure?' confirmation pop up when user selects yes/no for 'Is your prescriber mentor registered with the GPhC?'
   * 1.choiceConfirmed should be set to false below 
   * 2.call for askConfirmation method has to be uncommented - 
   */
  choiceConfirmed = true;

  hasTitle;
  hasMentorDetails;
  valid = false;

  counterSignatureDetails;
  counterSignature: Countersignature = {
    id: '',
    isMentorRegistered: null,
    prescriberMentorName: '',
    prescriberRegistrationNo: '',
    ukRegulatoryBody: '',
    registrationNumber: null,
    forenames: null,
    surname: null,
    countersignerGPhCId: null,
    decisionMadeAt: null,
    decision: null,
    feedback: null
  }
  deleteUrl = 'v1.0/pharmacistform/attachment';

  @Output() isMentorRegistered = new EventEmitter();

  constructor(formStpperService: FormStepperService, private docService: SupportingDocumentsService,
    private dialog: MatDialog) { 
    super(formStpperService);
  }

  ngOnInit(): void {
    if(this.application) {
      this.applicant = this.application;
      this.applicantFormDetails = this.applicant.activeForm;
      if(!this.applicantFormDetails.countersignatures || this.applicantFormDetails.countersignatures.length === 0) {      
        this.applicantFormDetails.countersignatures.push(this.counterSignature)
      }
      this.counterSignatureDetails = this.applicantFormDetails.countersignatures[0];      
      if(this.counterSignatureDetails.isMentorRegistered !==undefined && this.counterSignatureDetails.isMentorRegistered !== null){
        this.prescriberMentorNotRegistered = !this.counterSignatureDetails.isMentorRegistered;
        this.choiceConfirmed = this.nextStepClicked = true;
      }
      this.regulators = UKRegulators;
      this.checkIfAwardedDateMoreThanSixMonths();
    }
  }

  get countersigned() {
    return this.application?.activeForm?.formStatus === ApplicationStatus.CounterSigned;
  }

  propagate() {   
      this.validate();
  }

  validate() {
    let messages = [];
    
    if(this.prescriberMentorNotRegistered === undefined || this.prescriberMentorNotRegistered === null) {
      this.valid = false;
    } else {
      if(!this.prescriberMentorNotRegistered) {
        this.valid = true;
      } else {
        messages = this.docService.validate();
        this.valid = !!(this.applicantFormDetails.attachments?.length) && !messages.length;
        if(this.form) {
          this.valid = this.valid && !!this.counterSignatureDetails.prescriberMentorName
                        && !!this.counterSignatureDetails.prescriberRegistrationNo && !!this.counterSignatureDetails.ukRegulatoryBody
                        && !!this.applicantFormDetails.attachments;
        }
      }

      this.valid = this.valid && this.choiceConfirmed;
    }    

    if(!this.isDateBeyondSixMonths) {
      this.valid = true;
    }
        
    if(!this.valid) {
      if(this.choiceConfirmed) {
        messages.push('Please provide the required information.');
      } else {
        messages.push('Please confirm your choice.');
      }
    }

    this.validity$.next({ valid: this.valid, messages , touched: this.touched });
  }

  checkIfAwardedDateMoreThanSixMonths() {   
    this.isDateBeyondSixMonths = true;
    if( this.applicant?.dateAwarded) {
      let dateAwarded = new Date(this.applicant?.dateAwarded);
      let sixMonthsPostAwardedDate = new Date(dateAwarded.setMonth(dateAwarded.getMonth()+6));
      if(new Date(this.applicant?.dateAwarded).getDate() !== sixMonthsPostAwardedDate.getDate()) {
        sixMonthsPostAwardedDate.setDate(1);
      }
      if(new Date() >= sixMonthsPostAwardedDate) {
        this.isDateBeyondSixMonths = true;
      } else {
        this.isDateBeyondSixMonths = false;
        this.application.activeForm.formStatus = ApplicationStatus.InProgress;
      }
    }
  }

  onMentorRegistrationChange(value) {
    if(!value) {
      this.prescriberMentorNotRegistered = true;
    } else {
      this.prescriberMentorNotRegistered = false;
    }
    this.application.activeForm.formStatus = ApplicationStatus.InProgress;
    // comment below two lines if askConfirmation method is called
    this.isMentorRegistered.emit(!this.prescriberMentorNotRegistered);
    this.validate();
    // this.askConfirmation();
  }

  onDocUpload($event) {
    this.applicantFormDetails.attachments = $event;
    this.applicantFormDetails.attachments.forEach(attachment => {
      attachment.type = this.attachmentType;
    });
    this.deleteUrl = 'v1.0/pharmacistform/attachment';
    this.validate();
  }

  onDocDelete(file) {
    this.deleteUrl = '';
    this.applicantFormDetails.attachments = [];
    this.validate();
  }

  askConfirmation() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: `Important`,
        confirmText: 'Yes',
        cancelText: 'No',
        message: `<p>
             Are you sure you want to proceed?
              </p>
              `,
        confirmProgressReport: false
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.choiceConfirmed = true;
        this.isMentorRegistered.emit(!this.prescriberMentorNotRegistered);        
      } else {
        this.choiceConfirmed = false;
      }
      this.validate();
    });
    return dialogRef;
  }

  populateForm() {
    this.nextStepClicked = this.valid ? true: false;
  }
}
