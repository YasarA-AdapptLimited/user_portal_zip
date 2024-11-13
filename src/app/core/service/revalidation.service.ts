import { Injectable } from '@angular/core';
import { RevalidationItem } from '../../shared/model/revalidation/RevalidationItem';
import { Revalidation } from '../../shared/model/revalidation/Revalidation';
import { SubmissionExpectations } from '../../shared/model/revalidation/SubmissionExpectations';
import { RevalidationItemType } from '../../shared/model/revalidation/RevalidationItemType';
import { Observable } from 'rxjs/internal/Observable';
import { FormTemplate } from '../../dynamic/model/FormTemplate';
import { FormType } from '../../dynamic/model/FormType';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { CustomErrorHandler } from './CustomErrorHandler';
import { of as observableOf, from as observableFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { ExtCircListItem } from '../../shared/model/revalidation/ExtCircListItem';
import { FormAnswer } from '../../dynamic/model/FormAnswer';
import { ExtenuatingCircumstance } from '../../shared/model/revalidation/ExtenuatingCircumstance';
import { UploadType } from '../../shared/model/UploadType';
import { FileUpload } from '../../shared/model/FileUpload';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';

function revalidationFormTemplate(type: RevalidationItemType) {
  switch (type) {
    case RevalidationItemType.PeerDiscussion:
      return FormType.PeerDiscussionEntry;
    case RevalidationItemType.Planned:
      return FormType.PlannedCpdEntry;
    case RevalidationItemType.Unplanned:
      return FormType.UnplannedCpdEntry;
    case RevalidationItemType.ReflectiveAccount:
      return FormType.ReflectiveAccountEntry;
  }
}

function formTypeToRevalidationType(type: FormType) {
  switch (type) {
    case FormType.PeerDiscussionEntry:
      return RevalidationItemType.PeerDiscussion;
    case FormType.PlannedCpdEntry:
      return RevalidationItemType.Planned;
    case FormType.UnplannedCpdEntry:
      return RevalidationItemType.Unplanned;
    case FormType.ReflectiveAccountEntry:
      return RevalidationItemType.ReflectiveAccount;
  }
}


@Injectable()
export class RevalidationService extends ServiceBase {
  forms: any = {};
  templateGroup;
  pastSubmissions;

  constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
    super(http, auth, log, errorHandler);
  }
  /*
    getFormTemplate(type: RevalidationItemType): Observable<FormTemplate> {
      const url = `assets/cpd/formConfig/${RevalidationItemType[type]}.json`;
      return this._http.get(url)
        .map(response => <FormTemplate>response.json())
        .do(data => console.log(data));
    }
  */

  getFormTemplates(): Observable<Array<FormTemplate>> {
    if (this.templateGroup) {
      return observableOf(this.templateGroup);
    } else {
      return super.get(`v1.0/forms?group=2`)
        .pipe(map(data => {
          this.templateGroup = data;
          data.forEach(form => {
            this.forms[form.type] = form;
            this.forms[form.dynamicFormId] = form;
          });
          return this.templateGroup;
        }));
    }
  }

  getExceptionalCircumstanceRenewalDates() {
    return super.get(`v1.0/registrant/revalidation/extenuatingcircumstances/renewaldates`);
    /*
    return  observableOf([
      { renewalDate: '2017-10-31', name: 'Previous year' },
      { renewalDate: '2018-10-31', name: 'Current year' },
      { renewalDate: '2019-10-31', name: 'Next year' }
      ]);*/
  }

  getExtenuatingCircumstance(id): Observable<ExtenuatingCircumstance> {
    return super.get(`v1.0/registrant/revalidation/extenuatingcircumstances/${id}`);
  }

  getProof(file: FileUpload) {
    const url = `v1.0/${UploadType.ExtenuatingCircumstanceProof}/files/${file.fileId}`;
    return this.getFileWithToken(url);
  }


  getFeedback(id) {
    return super.get(`v1.0/registrant/submission/${id}/feedback`);
  }


  resetExtenuatingCircumstancesForm(id) {
    return super.delete(`v1.0/registrant/revalidation/extenuatingcircumstances/${id}`);
  }

  getExtenuatingCircumstancesFormTemplate(): Observable<FormTemplate> {
    const formType = 7;
    if (this.forms[formType]) {
      return observableOf(this.forms[formType]);
    } else {
      return super.get(`v1.0/forms?type=${formType}`)
        .pipe(map(data => {
          this.forms[formType] = data[0];
          return this.forms[formType];
        }));
    }
  }

  getFormTemplateByType(type: RevalidationItemType): Observable<FormTemplate> {
    if (this.forms[RevalidationItemType[type]]) {
      return observableOf(this.forms[RevalidationItemType[type]]);
    } else {
      return super.get(`v1.0/forms?type=${revalidationFormTemplate(type)}`)
        .pipe(map(data => {
          const form: FormTemplate = <FormTemplate>data[0];
          this.forms[RevalidationItemType[type]] = form;
          this.forms[form.dynamicFormId] = form;
          return form;
        }));
    }
  }

  getFormTemplateById(id: string): Observable<FormTemplate> {
    if (this.forms[id]) {
      return observableOf(this.forms[id]);
    } else {
      return super.get(`v1.0/forms/${id}`)
        .pipe(map(data => {
          const form: FormTemplate = <FormTemplate>data[0];
          this.forms[form.dynamicFormId] = form;
          return form;
        }));
    }
  }

  save(item: RevalidationItem, revalidationId) {
    if (item.id) {
      return super.put(`v1.0/registrant/revalidation/entries/${item.id}`, item);
    } else {
      return super.post(`v1.0/registrant/revalidation/${revalidationId}/entries`, item);
    }
  }

  delete(item: RevalidationItem) {
    return super.delete(`v1.0/registrant/revalidation/entries/${item.id}`);
  }

  submit(revalidationId) {
    return super.post(`v1.0/registrant/revalidation/${revalidationId}/submit`, {});
  }

  getEntry(id, revalidationId): Observable<RevalidationItem> {
    return super.get(`v1.0/registrant/revalidation/${revalidationId}/entries/${id}`)
      .pipe(map(data => {
        const item: RevalidationItem = <RevalidationItem>data.revalidationEntries[0];
        item.readonly = item.submitted;
        return item;
      }));
  }


  getEntries(id): Observable<RevalidationItem[]> {
    return super.get(`v1.0/registrant/revalidation/${id}/entries`)
      .pipe(map(data => data.revalidationEntries));
  }

  get(): Observable<Revalidation> {
    return super.get('v1.0/registrant/revalidation');
  }

  getPastSubmissions(): Observable<any> {

    return super.get('v1.0/registrant/submissions')
      .pipe(map(data => data.submissions));
  }

  patch(item: RevalidationItem, revalidationId) {
    return super.post(`v1.0/registrant/revalidation/${revalidationId}/entry/${item.id}`,
      {
        included: item.included,
        isCompleted: item.completed
      });
  }

  submitExtenuatingCircumstances(id) {
    return super.post(`v1.0/registrant/revalidation/ExtenuatingCircumstances/${id}/submit`, { });
  }

  saveExtenuatingCircumstances(payload) {
    return super.post(`v1.0/registrant/revalidation/ExtenuatingCircumstances`, payload);
  }

  getExtenuatingCircumstancesList(): Observable<Array<ExtCircListItem>> {
    return super.get(`v1.0/registrant/revalidation/ExtenuatingCircumstances/list`)
      .pipe(map(result => <Array<ExtCircListItem>>result.extenuatingCircumstanceListModels));
  }
  getLatestRevalidation(): Observable<Revalidation> {
    return super.get('v1.0/registrant/GetLatestRevalidation');
  }
}
