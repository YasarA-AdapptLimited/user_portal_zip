import { Input, Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Applicant } from '../../../account/model/Applicant';
import { TechnicianApplication } from '../../model/TechnicianApplication';
import { ApplicationProcessType } from '../../model/ApplicationProcessType';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';
import { WorkExperience } from '../../model/WorkExperience';
import { AttachmentType } from '../../../shared/model/AttachmentType';
import { TechnicianService } from '../../../core/service/technician.service';
import { SupportingDocumentsStepComponent } from '../supportingDocuments/supportingDocumentsStep.component';
import { FileUpload } from '../../../shared/model/FileUpload';

@Component({
  selector: 'app-technician-application-review',
  templateUrl: './technicianApplicationReview.component.html',
  styleUrls: ['./technicianApplicationReview.scss']
}) export class TechnicianApplicationReviewComponent  implements OnInit {

  applicant: Applicant;
  @Input() application: TechnicianApplication;
  @Input() readonly = false;
  @Input() showEdi = true;
  @Input() showOverallDeclaration = true;
  @Input() formId;
  @Input() pastApplication = false;
  @Input() showContactDetails = true;
  @Input() isCountersignerView = false;
  workExperiences: Array<WorkExperience>;
  ApplicationType = ApplicationProcessType;
  TechnicianApplicationStep = TechnicianApplicationStep;
  AttachmentType = AttachmentType;
  attachments: Array<FileUpload> = [];
  downloading = false;
  
  constructor(private service: TechnicianService) { }

  @Output() navigate = new EventEmitter<number>();
  ngOnInit() {
    this.applicant = this.application.trainee;
    this.workExperiences = this.application.activeForm.workExperiences;
    this.attachments = this.application.forms[0].attachments;
  }

  nth(i) {
    return i === 0 ? 'first' : (i === 1 ? 'second' : (i === 2 ? 'third' : 'fourth'));
  }

  goToStep(stepId) {
    this.navigate.emit(stepId);
  }

  download(file) {
    this.downloading = true;
    this.service.getSupportingDocuments(file).subscribe(blob => {
        const url = URL.createObjectURL(blob);
        const element = document.createElement('a');
        element.href = url;
        element.setAttribute('download', file.filename);
        document.body.appendChild(element); 
        element.click();
  
    });
  }
}
