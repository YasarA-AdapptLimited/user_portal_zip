import { Component, forwardRef, OnInit, Input, OnChanges, AfterViewInit, ChangeDetectorRef, AfterContentChecked, Output, EventEmitter } from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { UploadType } from '../../../shared/model/UploadType';
import { FileUpload } from '../../../shared/model/FileUpload';
import { AttachmentType } from '../../../shared/model/AttachmentType';
import utils from '../../../shared/service/utils';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../../core/tooltip/Tooltip';
import { SupportingDocumentsService } from '../../../shared/supportingDocuments/supportingDocuments.service';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';
import { ApplicationProcessType } from '../../model/ApplicationProcessType';
import { EducationDetails } from '../../model/EducationDetails';
import { TechnicianApplication } from '../../model/TechnicianApplication';

@Component({
  selector: 'app-supporting-documents-step',
  templateUrl: './supportingDocumentsStep.component.html',
  styleUrls: ['./supportingDocumentsStep.scss'],
  providers: [
    SupportingDocumentsService,
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => SupportingDocumentsStepComponent)
    }
  ]
})
export class SupportingDocumentsStepComponent extends FormStepComponent implements OnInit, AfterContentChecked, AfterViewInit {

  constructor(
    stepper: FormStepperService,
    private docService: SupportingDocumentsService,
    private changeDetector: ChangeDetectorRef) {
    super(stepper);
  }
  showDetailsHelp = false;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };
  title = 'Supporting documents';
  stepId = TechnicianApplicationStep.SupportingDocuments;
  hasProofOfId = false;
  hasQualification = false;
  attachments: { [key: number]: Array<FileUpload> } = [];
  AttachmentType = AttachmentType;
  uploadType = UploadType.PharmacyTechnicianSupportingDocuments;
  sessionId = utils.guid();
  requireQualificationCertificate = true;
  viewReady = false;
  registeredDocTypes = [];
  docTypes = 1;
  applicationTypeLessThanTwoYears;
  ApplicationProcessType = ApplicationProcessType;
  isCombinedQualification: boolean;
  educationDetails: EducationDetails;
  removeCombineDocs = false;
  @Output() dependentDocs = new EventEmitter();


  populateForm() { }

  ngOnInit() {
    this.educationDetails = (<TechnicianApplication>this.application).activeForm.educationDetails;
    if (this.application.forms[0].attachments) {
      this.application.forms[0].attachments.forEach(attachment => {
        this.attachments[attachment.type] = this.attachments[attachment.type] || [];
        this.attachments[attachment.type].push(attachment);
      });
    }
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }


  load() {
    this.isCombinedQualification = this.educationDetails.combined.qualificationId !== null ? true : false;
    if (this.viewReady) {
      this.ready$.next(true);
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      //this.application.activeForm.attachments = this.attachments;
      this.isCombinedQualification = this.educationDetails.combined.qualificationId !== null ? true : false;
      this.ready$.next(true);
      this.viewReady = true;
    });
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

  validate() {
    const messages = this.docService.validate();
    const appTypeLessThanTwoYears = this.application.activeForm.applicationType === ApplicationProcessType.LessThanTwoYears;
    const appTypeTwoYears = this.application.activeForm.applicationType === ApplicationProcessType.TwoYears;
    const isSupportingDocumentsForwarded = this.application.activeForm.isSupportingDocumentsForwardedConfirmed;
    const hasSupportingDocs = !!this.application.activeForm.attachments.length;

    if (appTypeLessThanTwoYears && !isSupportingDocumentsForwarded) {
      messages.push(`This section is mandatory, please confirm that you understand you must forward your
      supporting documents to the GPhC in order for your application to be processed.`);
    }

    if (appTypeTwoYears && !hasSupportingDocs) {
      messages.push('Please upload the necessary documents');
    }

    this.validity$.next({ valid: !messages.length, messages, touched: this.touched });
  }

  onUploaded($event) {
    this.attachments[$event.type] = $event.uploads;
    $event.uploads.forEach(upload => upload.type = $event.type);
    this.updateApplication();
  }

  updateApplication() {
    let attachments = [];
    this.isCombinedQualification = this.educationDetails.combined.qualificationId !== null ? true : false;
    for (const type in this.attachments) {
      attachments = attachments.concat(this.attachments[type]);
    }
    if (this.isCombinedQualification) {
      this.application.activeForm.attachments = attachments.filter(item => ((item.type === AttachmentType.KnowledgeBasedQualification) && (item.type === AttachmentType.CompetencyBasedQualification)));
      this.application.activeForm.attachments = attachments;
    } else if (!this.isCombinedQualification) {
      this.application.activeForm.attachments = attachments.filter(item => (item.type === AttachmentType.CombinedQualification));
      this.application.activeForm.attachments = attachments;
    }
    this.application.activeForm.attachments = attachments;
    this.validate();
    this.makeDirty();
  }

  getSupportingDocs() {
   this.application.activeForm.attachments = this.attachments;
    this.dependentDocs.emit();
  }
  clearAttachments() {
    this.attachments = [];
  }


}
