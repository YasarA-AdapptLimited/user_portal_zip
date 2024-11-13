import { Component, Input, OnInit, AfterViewInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { RevalidationService } from '../core/service/revalidation.service';
import { Form } from '../dynamic/model/Form';
import { Router, ActivatedRoute } from '@angular/router';
import { FormValidationService } from '../dynamic/service/formValidationService';
import { FormValidator } from '../dynamic/service/FormValidator';
import { ExtenuatingCircumstance } from '../shared/model/revalidation/ExtenuatingCircumstance';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirmDialog.component';
import { UploadType } from '../shared/model/UploadType';
import utils from '../shared/service/utils';
import { AuthService } from '../core/service/auth.service';
import { ExtCircListItem } from '../shared/model/revalidation/ExtCircListItem';
import { BehaviorSubject } from 'rxjs';
import { FileUpload } from '../shared/model/FileUpload';
import { ExtCircType } from '../shared/model/revalidation/ExtCircType';
import { ExtenuatingCircumstanceReviewDecision } from '../shared/model/revalidation/ExtenuatingCircumstanceReviewDecision';
import { Registrant } from '../registration/model/Registrant';
declare var require;
const cloneDeep = require('lodash.clonedeep');

@Component({
  moduleId: module.id,
  templateUrl: './submittedExtenuatingCircumstances.component.html',
  styleUrls: ['./submittedExtenuatingCircumstances.scss', 'extCirc.scss'],
  providers: [
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService }
  ]
})
export class SubmittedExtenuatingCircumstancesComponent implements OnInit {


  id;
  extenuatingCircumstance: ExtenuatingCircumstance;
  loading;
  started;
  ExtCircDecision = ExtenuatingCircumstanceReviewDecision;
  registrant: Registrant;

  constructor(private service: RevalidationService,
    public validator: FormValidationService,
    private router: Router,
    private dialog: MatDialog,
    private auth: AuthService,
    private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];

  }

  ngOnInit() {
    this.load();
    this.registrant = this.auth.user.registrant;
  }

  get adviceLink() {
    return `/revalidation/exceptional-circumstances/${this.id}/advice/${this.extenuatingCircumstance.type}`;
  }

  load() {
    this.loading = true;
    this.service.getExtenuatingCircumstance(this.id)
      .subscribe(saved => {
        this.extenuatingCircumstance = saved;
        this.service.getFormTemplateById(saved.dynamicFormId).subscribe(template => {
          this.extenuatingCircumstance.form = this.validator.setForm(template);
          this.validator.loadAnswers(this.extenuatingCircumstance.form, saved.answers);

          const extendUntil = this.validator.getQuestionByShortname(this.extenuatingCircumstance.form, 'extend_until');
          this.extenuatingCircumstance.type = extendUntil.answer ? ExtCircType.Extension : ExtCircType.Reduction;

          this.loading = false;
          setTimeout(() => { this.started = true; });
        });
      });
  }


  exit() {
    this.router.navigate(['/revalidation']);
  }


  download(file) {
    // this.downloading = true;
    this.service.getProof(file).subscribe(blob => {
      // this.downloading = false;
      const nav = (window.navigator as any);
      if (nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(blob, file.filename);
      } else {
        const url = URL.createObjectURL(blob);
        const element = document.createElement('a');
        element.href = url;
        element.setAttribute('download', file.filename);
        document.body.appendChild(element); // Append the element to work in firefox
        element.click();
      }
    });
  }

}
