import { Component, forwardRef, OnInit, Input } from '@angular/core';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { UploadType } from '../../shared/model/UploadType';
import { FileUpload } from '../../shared/model/FileUpload';
import { AttachmentType } from '../../shared/model/AttachmentType';
import utils from '../../shared/service/utils';
import { AuthService } from '../../core/service/auth.service';
import { RegApplicationStep } from '../../prereg/model/RegApplicationStep';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../core/tooltip/Tooltip';
import { SupportingDocumentsService } from '../../shared/supportingDocuments/supportingDocuments.service';
import { PreregApplicationStep } from '../../shared/model/student/PreregApplicationStep';

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
export class SupportingDocumentsStepComponent extends FormStepComponent implements OnInit {

  constructor(private authService: AuthService, stepper: FormStepperService, private docService: SupportingDocumentsService) {
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
  title = 'Documents';
  stepId = PreregApplicationStep.SupportingDocuments;
  hasProofOfId = false;
  hasQualification = false;
  attachments: { [key: number]: Array<FileUpload> } = {};
  AttachmentType = AttachmentType;
  uploadType = UploadType.RegistrationFormSupportingDocuments;
  sessionId = utils.guid();
  requireQualificationCertificate = true;
  viewReady = false;
  registeredDocTypes = [];
  docTypes = 1;
  

  populateForm() { }

  ngOnInit() {

    if (this.application.forms[0].attachments) {
      this.application.forms[0].attachments.forEach(attachment => {
        this.attachments[attachment.type] = this.attachments[attachment.type] || [];
        this.attachments[attachment.type].push(attachment);
      });
    }

  }

  load() {
    if (this.viewReady) {
      this.ready$.next(true);
    }    
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
    this.validity$.next({ valid: !messages.length, messages, touched: this.touched });
  }

  onUploaded($event) {
    this.attachments[$event.type] = $event.uploads;
    $event.uploads.forEach(upload => upload.type = $event.type);
    this.updateApplication();
  }

  updateApplication() {
    let attachments = [];
    for (const type in this.attachments) {
      attachments = attachments.concat(this.attachments[type]);
    }
    this.application.activeForm.attachments = attachments;
    this.validate();
    this.makeDirty();
  }

}
