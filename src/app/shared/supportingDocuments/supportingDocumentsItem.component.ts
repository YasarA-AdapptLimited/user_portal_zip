import { Input, Output, Component, EventEmitter, OnInit } from '@angular/core';
import { UploadType } from '../model/UploadType';
import { FileUpload } from '../model/FileUpload';
import { AttachmentType } from '../model/AttachmentType';
import { Tooltip } from '../../core/tooltip/Tooltip';
import { SupportingDocumentsService } from './supportingDocuments.service';
import { isTemplateExpression } from 'typescript';

@Component({
  selector: 'app-supporting-documents-item',
  templateUrl: './supportingDocumentsItem.component.html',
  styleUrls: ['./supportingDocumentsItem.scss']
}) export class SupportingDocumentsItemComponent implements OnInit {
  @Input() isStudent = false;
  @Input() isTechnician = false;
  @Input() isAssessmentReport = false;
  @Input() isAssessmentRegistration = false;
  @Input() isRTR = false;
  @Input() sessionId;
  @Input() touched;
  uploadType = UploadType.RegistrationFormSupportingDocuments;
  showHelp = false;
  deleteUrl='v1.0/registrationform/attachment';
  titleOptions = ['Passport', 'Photo driving license', 'NI card', 'NHS card', 'Photo ID card'];
  @Input() min = 1;
  @Input() max = 1;
  @Input() mandatory = false;
  @Input() attachments: { [key: number]: Array<FileUpload> };
  @Input() attachmentType: AttachmentType;
  @Input() requireTitle = false;
  @Input() requireExpiryDate = false;
  @Input() requireCertifier = true;
  @Input() requirePOCertifier = true;
  @Input() isPostOfficeSelected = false;
  @Input() title;
  @Output() uploaded = new EventEmitter<{ uploads: Array<FileUpload>, type: AttachmentType }>();
  @Output() registered = new EventEmitter<AttachmentType>();
  @Input() requiresAdditionalQuestion = false;
  @Input() qualificationType;
  isInEnglish = false;
  @Input() certifierTypes = [];
  @Input() isCCPS = false;

  constructor(private service: SupportingDocumentsService) {

  }

  helpTooltip: Tooltip = {
    id: 'help',
    content: 'Click for help on <br/>how to fill in this section',
    width: 230,
    placement: 'right',
    order: -1
  };

  onUploaded($event) {
    const uploads = $event;
    this.uploaded.emit({ uploads, type: this.attachmentType });
  }

  get valid() {
    return !this.mandatory || (this.attachments[this.attachmentType] && !!this.attachments[this.attachmentType].length);
  }

  get PTValid() {
    return !(this.mandatory && (this.attachments[this.attachmentType] && !!this.attachments[this.attachmentType].length));
  }

  ngOnInit() {
    if (this.isStudent) {
      this.uploadType = UploadType.PreRegistrationFormSupportingDocuments;
    }
    if (this.isRTR) {
      this.uploadType = UploadType.ReturnToRegisterSupportingDocuments;
      this.deleteUrl= 'v1.0/pharmacistform/attachment';
    }
    if (this.isTechnician) {
      this.uploadType = UploadType.PharmacyTechnicianSupportingDocuments;
      this.titleOptions = ['Passport or EEA ID card', 'Photo drivers licence'];
    }
    if (this.isAssessmentReport) {
      this.uploadType = UploadType.ProgressReportSupportingDocuments;
      this.titleOptions = ['Photo ID card'];
    }
    if (this.isAssessmentRegistration) {
      this.uploadType = UploadType.AssessmentRegistrationDocuments;
      this.titleOptions = ['Photo ID card', 'Passport or EEA ID card'];
    }
    if( this.isCCPS ) {
      this.uploadType = UploadType.ProfessionalStandingSupportingDocuments;
      this.deleteUrl = 'v1.0/pharmacistform/attachment';
    }
    this.service.add(this.attachmentType, this.validate.bind(this));
    this.registered.emit(this.attachmentType);
  }

  validate(): Array<string> {
    const messages = [];
    const hasUploads = (this.attachments[this.attachmentType] && this.attachments[this.attachmentType].length);
    const title = this.title.toLowerCase();

    if (this.mandatory && !hasUploads) {
      messages.push(`You haven't uploaded your ${title}`);
    }
    if (hasUploads) {
      if (this.attachments[this.attachmentType].length < this.min) {
        messages.push(`You must upload ${this.min} documents`);
      }
      this.attachments[this.attachmentType].forEach(doc => {
        if (this.requireExpiryDate) {
          if (!doc.expiryDate) {
            messages.push(`You must enter an expiry date for ${title} documents`);
          }
          if (new Date(doc.expiryDate) < new Date()) {
            messages.push(`Expiry date for ${title} must be in the future`);
          }
        }

        if (this.requireTitle && !doc.title) {
          messages.push(`You must enter a title for ${title} documents`);
        }
        if (this.requireCertifier ) {
          const hasCertifier = item =>
            item.certifier &&
            item.certifier.companyName &&
            item.certifier.companyName.trim().length &&
            item.certifier.date &&
            item.certifier.name &&
            item.certifier.name.trim().length &&
            item.certifier.number && item.certifier.number.trim().length &&
            item.certifier.type;
            const hasPOCertifierTypeSelected = doc.certifier.type === 'Post Office';
              const hasCertifiedDate = doc.certifier.date;
              const hasPOCertifier = item => {
                item.certifier.name = '',
                item.certifier.companyName = '',
                item.certifier.number = '';
              };

          switch (this.attachmentType) {
            case AttachmentType.BirthCertificate:
              const hasSelectedIsDuplicateCopy = doc.isDuplicateCopy !== undefined;
              if (doc.isDuplicateCopy === true) {
                doc.certifier.type = 'Solicitor';
              }
              if (!hasSelectedIsDuplicateCopy) {
                messages.push(`You must specify whether your birth certificate is a duplicate copy or not`);
              } else {
                if (doc.isDuplicateCopy !== null) {
                  if (!hasCertifier(doc)) {
                    messages.push(`You haven't entered all the certifier details for your ${title}`);
                  }
                }
              }
              break;
              case AttachmentType.ProofOfIdentity:
              if (hasPOCertifierTypeSelected) {
               hasPOCertifier(doc);
               !hasCertifier(doc);
                if (!hasCertifiedDate) {
                  messages.push(`You haven't entered certified date for your ${title}`);
                }
              }
              break;
              case AttachmentType.KnowledgeBasedQualification:
                if (hasPOCertifierTypeSelected) {
                  hasPOCertifier(doc);
               !hasCertifier(doc);
                  if (!hasCertifiedDate) {
                    messages.push(`You haven't entered certified date for your ${title}`);
                  }
                }
                break;
                case AttachmentType.CompetencyBasedQualification:
                  if (hasPOCertifierTypeSelected) {
                    hasPOCertifier(doc);
               !hasCertifier(doc);
                    if (!hasCertifiedDate) {
                      messages.push(`You haven't entered certified date for your ${title}`);
                    }
                  }
                  break;
                  case AttachmentType.CombinedQualification:
                    if (hasPOCertifierTypeSelected) {
                      doc.certifier.name = '';
                      doc.certifier.companyName = '';
                      doc.certifier.number = '';
                      if (!hasCertifiedDate) {
                        messages.push(`You haven't entered certified date for your ${title}`);
                      }
                    }
                    break;
            // implement if required
            default:
              if (doc.isDuplicateCopy !== null && !hasCertifier(doc)) {
                messages.push(`You haven't entered all the certifier details for your ${title}`);
              }
          }

        }
      });

    }

    return messages;
  }

}
