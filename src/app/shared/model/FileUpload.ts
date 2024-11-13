import { UploadStatus } from './UploadStatus';

export interface FileUpload {
  file?: File;
  status?: UploadStatus;
  error?: string;
  invalidType?: boolean;
  tooBig?: boolean;

  type?: number;
  fileId?: string;

  filename?: string;
  filesize?: number;
  deleteUrl?: string;

  expiryDate?: string;
  title?: string;
  isDuplicateCopy?: boolean;
  isDocumentInEnglish?: boolean;
  certifier?: {
    name?: string;
    number?: string;
    type?: string;
    companyName?: string;
    date?: string;
  };
}
