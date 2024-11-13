import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { Observable } from 'rxjs/internal/Observable';
import { RequestOptions, Headers } from '@angular/http';
import { CustomErrorHandler } from './CustomErrorHandler';


import { UploadType } from '../../shared/model/UploadType';
import { FileUpload } from '../../shared/model/FileUpload';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UploadService extends ServiceBase {

  constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
    super(http, auth, log, errorHandler);
  }

  upload(type: UploadType, formData: FormData, sessionId: string) {
    const url = `v1.0/${type}/uploads/${sessionId}`;
    return this.post(url, formData);
  }

  deleteFile(upload: FileUpload, deleteUrl) {
    return this.delete(`${deleteUrl}/${upload.fileId}`);
  }
}
