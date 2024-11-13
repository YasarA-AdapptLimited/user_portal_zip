import { Input, Component, OnInit } from '@angular/core';
import { AttachmentType } from '../model/AttachmentType';
import { PreregService } from '../../core/service/prereg.service';

import { AuthService } from '../../core/service/auth.service';
import { TechnicianService } from '../../core/service/technician.service';
import { AssessmentReportService } from '../../core/service/assessmentReport.service';
import { AssessmentRegistrationService } from '../../core/service/assessmentRegistration.service';
import { ReturnToRegisterService } from '../../core/service/returnToRegister.service';

@Component({
  selector: 'app-supporting-documents-summary',
  templateUrl: './supportingDocumentsSummary.component.html',
  styleUrls: ['./supportingDocumentsSummary.scss']
}) export class SupportingDocumentsSummaryComponent implements OnInit {

  @Input() application;
  @Input() formId;
  @Input() isStudent;
  @Input() isAros;
  @Input() isRTR;
  @Input() isTechnician;
  @Input() isAssessmentRegistration;
  @Input() isCountersignerView = false;
  @Input() removeAllButPhotos = false;
  attachments: Array<any>;
  AttachmentType = AttachmentType;

  constructor(
    private service: PreregService,

    private technicianService: TechnicianService,

    private arosService: AssessmentReportService,

    private assessmentService: AssessmentRegistrationService,

    private rtrService: ReturnToRegisterService
  ) { }

  ngOnInit() {

    if (this.formId) {
      this.attachments = this.putInAlphabeticalOrder(this.application.pastApplications
        .find(val => val.id === this.formId).attachments);
    } else {
      this.attachments = this.putInAlphabeticalOrder(this.application.activeForm.attachments);
    }
    // remove the photo docs when countersignatory is reviewing the application
    if (this.isCountersignerView) {
      this.attachments = this.attachments.filter(this.removePhotoDocsFromSupportingDocs);
    }

    if (this.removeAllButPhotos) {
      this.attachments = this.attachments.filter(this.removeAllButPhotoDocsFromSupportingDocs);
    }
  }

  putInAlphabeticalOrder(arr) {
    if (arr.isArray) {
      arr.sort((a, b) => {
        return (AttachmentType[a.type] < AttachmentType[b.type]) ? -1 : 1;
      });
    } else {
      arr = Object.keys(arr).map((key) => arr[key]);
    }
    return arr;
  }

  removeAllButPhotoDocsFromSupportingDocs(element, index, array) {
    return element.type === AttachmentType.Photo;
  }

  removePhotoDocsFromSupportingDocs(element, index, array) {
    return element.type !== AttachmentType.Photo;
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

  download(file) {
    // this.downloading = true;
    const createDownload = (blob) => {
      // console.log(blob);
      // this.downloading = false;
      // if (window.navigator.msSaveOrOpenBlob) { // stupid IE
      //   window.navigator.msSaveOrOpenBlob(blob, file.filename);
      // } else {
      const url = URL.createObjectURL(blob);
      const element = document.createElement('a');
      element.href = url;
      element.setAttribute('download', file.filename);
      document.body.appendChild(element); // Append the element to work in firefox
      element.click();
     // }
    };


    if (this.isTechnician) {
      this.technicianService.getSupportingDocuments(file).subscribe(blob => {
        createDownload(blob);
      });
    } else if (this.isStudent) {
      this.service.getStudentSupportingDocs(file).subscribe(blob => {
        createDownload(blob);
      });
    } 
    else if (this.isRTR) {
      this.rtrService.getSupportingDocument(file).subscribe(blob => {
        createDownload(blob);
      });
    }
    else if (this.isAros) {
      this.arosService.getProgressReportSupportingDocs(file).subscribe(blob => {
        createDownload(blob);
      });
    }
    else if (this.isAssessmentRegistration) {
      this.assessmentService.getAssessmentRegistrationSupportingDocs(file).subscribe(blob => {
        createDownload(blob);
      });
    }
    else {
      this.service.getSupportingDocument(file).subscribe(blob => {
        createDownload(blob);
      });
    }

  }

}
