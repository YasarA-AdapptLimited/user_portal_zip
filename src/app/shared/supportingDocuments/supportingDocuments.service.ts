import { Injectable } from '@angular/core';
import { AttachmentType } from '../model/AttachmentType';

@Injectable()
export class SupportingDocumentsService {
  validators: Array<{type: AttachmentType, validate: () => Array<string>}> = [];

  clear() {
    this.validators = [];
  }
  add(type: AttachmentType, validate: () => Array<string>) {
    if (!this.validators.find(v => v.type === type)) {
      this.validators.push({type, validate});
    }
  }

  validate(): Array<string> {
    let messages = [];
    this.validators.forEach(validator => {
      messages = messages.concat(validator.validate());
    });
    return messages;
  }

}
