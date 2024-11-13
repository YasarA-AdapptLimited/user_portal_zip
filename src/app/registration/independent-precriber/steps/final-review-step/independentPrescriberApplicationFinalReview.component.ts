import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IndependentPrescriberApplication } from '../../model/IndependentPrescriberApplication';
import { Registrant } from '../../../../registration/model/Registrant';
import { ApplicationStatus } from '../../../../technician/model/ApplicationStatus';
import { Applicant } from '../../../../account/model/Applicant';
import { IndependentPrescriberApplicationStep } from '../../model/IndependentPrescriberApplicationStep';
import { AttachmentType } from '../../../../shared/model/AttachmentType';
import { UploadType } from '../../../../shared/model/UploadType';
import { IndependentPrescriberService } from '../../../../core/service/independentPrescriber.service';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-independent-prescriber-final-review',
  templateUrl: './independentPrescriberApplicationFinalReview.component.html',
  styleUrls: ['./independentPrescriberFinalReview.scss']
}) export class IndependentPrescriberFinalReviewComponent implements OnInit {
  downloading = false;
  getAwardedDate = false;
  get submitted() {
    return this.application.activeForm.formStatus === ApplicationStatus.Submitted;
  }

  @Input() application: IndependentPrescriberApplication;
  @Input() readonly = true;
  registrant: Registrant;
  AttachmentType = AttachmentType;
  uploadType = UploadType.InpendentPrescriberSupportDocuments;

  applicant: Applicant;
  @Input() formId;
  IndependentPrescriberStep = IndependentPrescriberApplicationStep;
  attachments;


  constructor(private service: IndependentPrescriberService ) { }

  @Output() navigate = new EventEmitter<number>();
  ngOnInit() {
    this.attachments = this.application.activeForm.attachments;
  }
  get mentorName() {
    return this.application.activeForm.countersignatures[0].forenames + ' ' + this.application.activeForm.countersignatures[0].surname;
  }

  getIcon(file) {
    const bits = file.filename.split('.');
    const extension = bits[bits.length - 1];
    switch (extension) {
        case 'pdf':
            return 'fa fa-file-pdf-o';
        case 'png':
        case 'jpg':
        case 'bmp':
        case 'gif':
            return 'fa fa-file-image-o';
        case 'doc':
        case 'docx':
            return 'fa fa-file-word-o';
        case 'zip':
        case 'rar':
            return 'fa fa-file-archive-o';
        default:
            return 'fa fa-file-o';
    }
}

getAwarededDate() {
this.getAwardedDate = true;
  if ( this.application.dateAwarded) {
    const dateAwarded = new Date(this.application.dateAwarded);
    const sixMonthsPostAwardedDate = new Date(dateAwarded.setMonth(dateAwarded.getMonth() + 6));
    if (new Date(this.application.dateAwarded).getDate() !== sixMonthsPostAwardedDate.getDate()) {
      sixMonthsPostAwardedDate.setDate(1);
    }
    if (new Date() >= sixMonthsPostAwardedDate) {
      this.getAwardedDate = true;
    } else {
      this.getAwardedDate = false;
    }
  }

}

download(file) {
  this.downloading = true;
  this.service.getProof(file).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const element = document.createElement('a');
      element.href = url;
      element.setAttribute('download', file.filename);
      document.body.appendChild(element); // Append the element to work in firefox
      element.click();

  });
}

}
