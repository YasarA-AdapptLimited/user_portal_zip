import { Component, Input, OnInit, Output,
  EventEmitter, ViewChild, ElementRef, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/service/auth.service';
import { UploadService } from '../core/service/upload.service';
import { UploadType } from './model/UploadType';
import { FileUpload } from './model/FileUpload';
import { UploadStatus } from './model/UploadStatus';
import { LayoutService } from '../core/service/layout.service';
import { AttachmentType } from './model/AttachmentType';
@Component({
  selector: 'app-file-upload',
  moduleId: module.id,
  templateUrl: './fileUpload.component.html',
  styleUrls: ['fileUpload.scss']
})
export class FileUploadComponent implements AfterContentChecked{
  files: Array<FileUpload> = [];
  UploadStatus = UploadStatus;
  user:any
  uploading = false;
  @Input() allowedFileTypes = ['.pdf', '.PDF', '.doc', '.DOC', '.docx', '.DOCX', '.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG', '.gif', '.GIF'];
  allowedFileTypesString;
  @ViewChild('defaultCertifierTemplate', { static: true }) defaultCertifierTemplate;
  @ViewChild('photoCertifierTemplate', { static: true }) photoCertifierTemplate;
  @ViewChild('birthCertificateCertifierTemplate', { static: true }) birthCertificateCertifierTemplate;
  get certifierTemplate() {
    if (this.requireCertifier) {
      switch (this.attachmentType) {
        case AttachmentType.Photo:
          return this.photoCertifierTemplate;
        case AttachmentType.BirthCertificate:
          return this.birthCertificateCertifierTemplate;
        default:
          return this.defaultCertifierTemplate;
      }
    }
  }

  @Input() deleteUrl = 'v1.0/registrationform/attachment';
  @Input() sessionId: string;
  @Input() requireTitle: boolean;
  @Input() requireExpiryDate: boolean;
  @Input() requireCertifier: boolean;
  @Input() requirePOCertifier: boolean;
  @Input() titleOptions = [];
  @Input() touched = false;
  @Input() min: number;
  @Input() max: number;
  @Input() maxMb: number;
  @Input() type: UploadType;
  @Input() additionalQuestion = false;
  @Input() disableDeleteButton = false;
  @Output() uploaded = new EventEmitter<Array<FileUpload>>();
  @Output() deleted = new EventEmitter<FileUpload>();
  @Input('existing') set setExisting(existing: Array<FileUpload>) {
    if (!!existing && !!existing.length) {
      this.files = existing.map(f => {
        f.fileId =  (<any>f).fstFileId || f.fileId;
        f.filesize = (<any>f).fileSize || f.filesize;
        f.status = UploadStatus.Uploaded;
        f.certifier = f.certifier || {};
        return f;
      });
    } else {
      this.files = [];
    }
  }
  @Input() attachmentType: AttachmentType;
  AttachmentType = AttachmentType;
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() certifierTypes = ['Post Office', 'Solicitor', 'Commissioner of Oaths', 'Notary Public', 'Barrister', 'Legal Executive', 'Licenced Conveyancer', 'Other'];
  birthCertificateCertifierTypes = new Array();
  isBirthCertificateIsSolicitor;
  constructor(private auth: AuthService, private service: UploadService, public layout: LayoutService,
     private changeDetector: ChangeDetectorRef) {
    this.allowedFileTypesString = this.allowedFileTypes.join(',');
    this.birthCertificateCertifierTypes = this.certifierTypes.filter(function(value, index, arr){ 
      return value !== 'Post Office';
  });
    this.isBirthCertificateIsSolicitor = 'Solicitor';
   }

   ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  delete(upload: FileUpload) {
    upload.status = UploadStatus.Pending;
    this.service.deleteFile(upload, this.deleteUrl).subscribe(() => {
      const idx = this.files.indexOf(upload);
      this.deleted.emit(upload);
      this.files.splice(idx, 1);
      this.uploaded.emit(this.uploadedFiles);
      if (this.fileInput) {
        this.fileInput.nativeElement.value = null;
      }
    }, error => {
      upload.status = UploadStatus.Error;
      upload.error = error.message || error;
    });
  }

  deleteAll() {
    this.files.forEach(file => {
      this.delete(file);
    });
  }

  get today() {
    return new Date();
  }

  propagate() {
    const hasPhotoDrivingLiscense = this.uploadedFiles.find(file => file.title === 'Photo drivers licence');
    if (hasPhotoDrivingLiscense) {
      this.titleOptions = ['GP registration letter', 'National insurance card', 'Other'];
    }
    this.uploaded.emit(this.uploadedFiles);
  }

  remove(upload) {
    this.files = this.files.filter(f => f !== upload);
  }

  get uploadedFileCount() {
    return this.uploadedFiles.length;
  }

  get uploadedFiles() {
    return this.files.filter(f => f.status === UploadStatus.Uploaded);
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        const file: File = fileList[i];

        if (file.size > +this.maxMb * 1000000) {
          this.files.push( { file, error: 'Too large', tooBig: true, status: UploadStatus.Error } );
          continue;
        }
        const bits = file.name.split('.');
        const extension = '.' + bits[bits.length - 1];

        if (this.allowedFileTypes.indexOf(extension) === -1) {
          this.files.push( { file, error: 'Invalid file type', invalidType: true, status: UploadStatus.Error } );
          continue;
        }
        const upload: FileUpload = {
          filename: file.name,
          filesize: file.size,
          status: UploadStatus.Pending,
          error: null,
          certifier: { }
        };
        this.files.push(upload);
        if (upload.isDuplicateCopy === true) {
           upload.certifier.type = 'Solicitor';
        }
        const formData: FormData = new FormData();
        formData.append(file.name, file, file.name);
        if (!this.type) {
          throw new Error('Upload type must be provided to the upload component');
        }
        this.uploading = true;
        this.service.upload(this.type, formData, this.sessionId).subscribe(
          data => {
            upload.status = UploadStatus.Uploaded;
            Object.assign(upload, data[0]);
            this.uploaded.emit(this.uploadedFiles);
            this.uploading = false;
          },
          error => {
            upload.status = UploadStatus.Error;
            upload.error = error.message || error;
            this.uploading = false;
          }
        );
      }
    }
  }


}
