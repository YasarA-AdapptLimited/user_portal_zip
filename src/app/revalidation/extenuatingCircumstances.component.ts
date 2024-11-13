import { Component, Input, OnInit, AfterViewInit, ViewChildren, ChangeDetectorRef, ViewChild } from '@angular/core';
import { RevalidationService } from '../core/service/revalidation.service';
import { Router } from '@angular/router';
import { FormValidationService } from '../dynamic/service/formValidationService';
import { FormValidator } from '../dynamic/service/FormValidator';
import { ExtenuatingCircumstance } from '../shared/model/revalidation/ExtenuatingCircumstance';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirmDialog.component';
import { UploadType } from '../shared/model/UploadType';
import utils from '../shared/service/utils';
import { AuthService } from '../core/service/auth.service';
import { tap } from 'rxjs/operators';
import { Tooltip } from '../core/tooltip/Tooltip';
declare var require;
const cloneDeep = require('lodash.clonedeep');

@Component({
  selector: 'app-extenuating-circumstances',
  moduleId: module.id,
  templateUrl: './extenuatingCircumstances.component.html',
  styleUrls: ['./extenuatingCircumstances.scss'],
  providers: [
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService }
  ]
})
export class ExtenuatingCircumstancesComponent implements OnInit, AfterViewInit {

  helpTooltip: Tooltip = {
    id: 'help',
    content: 'Click for more information about this section.',
    width: 290,
    placement: 'right',
    order: -1
  };

  extenuatingCircumstances: { [key: string]: ExtenuatingCircumstance } = { };

  uploadType = UploadType.ExtenuatingCircumstanceProof;
  loading = false;
  submitting = false;
  saving = false;
  submitted = false;
  started = false;
  hasUploadedFiles = false;
  sessionId = utils.guid();
  currentYear;
  lastYear;
  nextYear;
  renewalDates;
  selectedYear;
  currentTemplate;
  serverErrors = [];
  confirmedGenuine;
  showNotDueMessage = false;
  showWarningMessage = false;
  @ViewChildren('focus') vc;

  constructor(private service: RevalidationService,
    public validator: FormValidationService,
    private router: Router,
    private dialog: MatDialog,
    private auth: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loading = true;

    this.validator.state$.subscribe(forms => {
      if (this.extenuatingCircumstance) {
        this.extenuatingCircumstance.form = forms.find(f => f.id === this.selectedYear.toString());
      }
    });

    this.loadTemplate().subscribe(template => {

      this.currentTemplate = template;

      this.service.getExceptionalCircumstanceRenewalDates().subscribe(response => {

        const dates = response.renewalDates;
        this.showWarningMessage = response.showWarningMessage;
        this.showNotDueMessage = response.showNotDueMessage;
        if (!dates || !dates.length) {
          this.loading = false;
        } else {
          this.renewalDates =  dates;
          const lastYear  = dates.find(date => date.name.toLowerCase() === 'previous year');
          if (lastYear) {
            this.lastYear = lastYear.renewalDate.split('T')[0];
          }
          const currentYear  = dates.find(date => date.name.toLowerCase() === 'current year');
          if (currentYear) {
            this.currentYear = currentYear.renewalDate.split('T')[0];
          }
          const nextYear  = dates.find(date => date.name.toLowerCase() === 'next year');
          if (nextYear) {
            this.nextYear = nextYear.renewalDate.split('T')[0];
          }

          this.createForms();
        }
 
      });

    });

  }

  get extenuatingCircumstance() {
    return this.extenuatingCircumstances[this.selectedYear];
  }

  resetForm() {
    this.loading = true;
    this.service.resetExtenuatingCircumstancesForm(this.extenuatingCircumstance.id)
      .subscribe(() => {

        this.extenuatingCircumstance.proofs = [];
        delete this.extenuatingCircumstance.form;
        delete this.extenuatingCircumstance.answers;
        this.extenuatingCircumstance.subject = '';
        delete this.extenuatingCircumstance.id;
        this.validator.removeForm(this.selectedYear.toString());
        this.extenuatingCircumstance.form = this.validator.addForm(this.currentTemplate, this.selectedYear.toString());
        this.extenuatingCircumstance.dynamicFormId = this.currentTemplate.dynamicFormId;
        this.hidePeerDiscussionAndReflectiveAccount(this.extenuatingCircumstance);
        this.setMaxExtensionDate(this.extenuatingCircumstance);
        this.validator.updateState();
        this.loading = false;
      });
  }

  hidePeerDiscussionAndReflectiveAccount(extCirc: ExtenuatingCircumstance) {
    const renewalDate = new Date(extCirc.renewalDate);
    const showFromDate = new Date('2019-10-31');
    const required = renewalDate >= showFromDate;
    if (!required) {
      const peerDiscussion = this.validator.getQuestionByShortname(extCirc.form, 'include_peer_discussion');
      const peerDiscussionNo = peerDiscussion.alternatives.find(alt => alt.name === 'N');
      peerDiscussion.isHidden = true;
      peerDiscussion.isRequired = false;
     const reflectiveAccount = this.validator.getQuestionByShortname(extCirc.form, 'include_reflective_account');
    //  const reflectiveAccountNo = reflectiveAccount.alternatives.find(alt => alt.name === 'N');
      reflectiveAccount.isHidden = true;
      reflectiveAccount.isRequired = false;
    //  this.validator.setAnswer(extCirc.form.id, peerDiscussion.id, peerDiscussionNo.id);
    //  this.validator.setAnswer(extCirc.form.id, reflectiveAccount.id, reflectiveAccountNo.id);
    }

  }

  loadTemplate() {
    return this.service.getExtenuatingCircumstancesFormTemplate()
      .pipe(tap(template => {
        this.currentTemplate = template;
      }));
  }

  loadComplete() {
    if (this.currentYear) {
      this.selectYear(this.currentYear);
    } else if (this.nextYear) {
      this.selectYear(this.nextYear);
    } else if (this.lastYear) {
      this.selectYear(this.lastYear);
    }
    this.loading = false;
    this.setFocus();
  }

  setFocus() {
    setTimeout(function () {
      if (this.vc.first) {
        this.vc.first.nativeElement.focus();
        this.started = true;
      }
    }.bind(this), 10);
  }


  createForms() {
    this.service.getExtenuatingCircumstancesList().subscribe(list => {
      const saved = list.filter(item => !item.submittedAt);
      saved.forEach(item => {
        item.renewalDate = item.renewalDate.split('T')[0];
      });
      const init = date => {
        const created = saved.find(item => item.renewalDate === date);
        const extCirc: ExtenuatingCircumstance = {
          renewalDate: date,
          sessionId: this.sessionId
        };
        if (created) {
          extCirc.id = created.id;
          extCirc.subject = created.subject;
        }
        this.extenuatingCircumstances[date] = extCirc;
      };
      if (this.lastYear) {
        init(this.lastYear);
      }
      if (this.currentYear) {
        init(this.currentYear);
      }
      if (this.nextYear) {
        init(this.nextYear);
      }
      for (const key in this.extenuatingCircumstances) {
        this.createForm(this.extenuatingCircumstances[key]);
      }
    });
  }

  onDeleted(file) {
    this.extenuatingCircumstance.proofs = this.extenuatingCircumstance.proofs.filter(proof => {
      return proof.fileId !== file.fileId;
    });
  }

  onUploaded(files) {
    this.extenuatingCircumstance.proofs = files;
  }
  get valid() {
    return this.extenuatingCircumstance.form &&
      this.extenuatingCircumstance.form.completed &&
      this.extenuatingCircumstance.proofs &&
      this.extenuatingCircumstance.proofs.length &&
      this.extenuatingCircumstance.subject &&
      this.confirmedGenuine;
  }

  ngAfterViewInit() {
    if (this.vc.first) {
      this.vc.first.nativeElement.focus();
    }
  }


  selectYear(year) {
    this.selectedYear = year;
    this.validator.updateState();
  }

  createForm(extCirc: ExtenuatingCircumstance) {

    if (extCirc.id) {
      this.service.getExtenuatingCircumstance(extCirc.id)
        .subscribe(saved => {
          extCirc.subject = saved.subject;
          extCirc.proofs = saved.proofs.map(proof => {
            proof.fileId = proof.fileId || proof.fstFileId;
            return proof;
          });
          if (saved.dynamicFormId !== this.currentTemplate.dynamicFormId) {
            this.service.getFormTemplateById(saved.dynamicFormId).subscribe(template => {
              extCirc.form = this.validator.addForm(cloneDeep(template), extCirc.renewalDate);
              this.setMaxExtensionDate(extCirc);
              this.hidePeerDiscussionAndReflectiveAccount(extCirc);
              extCirc.dynamicFormId = template.dynamicFormId;
              this.validator.loadAnswers(extCirc.form, saved.answers);
              this.checkLoadCompleted();
            });
          } else {
            extCirc.form = this.validator.addForm(cloneDeep(this.currentTemplate), extCirc.renewalDate);
            this.setMaxExtensionDate(extCirc);
            this.hidePeerDiscussionAndReflectiveAccount(extCirc);
            extCirc.dynamicFormId = this.currentTemplate.dynamicFormId;
            this.validator.loadAnswers(extCirc.form, saved.answers);
            this.checkLoadCompleted();
          }
        });
    } else {
      extCirc.form = this.validator.addForm(cloneDeep(this.currentTemplate), extCirc.renewalDate);
      extCirc.dynamicFormId = this.currentTemplate.dynamicFormId;
      this.setMaxExtensionDate(extCirc);
      this.hidePeerDiscussionAndReflectiveAccount(extCirc);
      this.checkLoadCompleted();
    }
  }

  setMaxExtensionDate(extCirc) {
    /*  Business rule to verify that extension date is no longer than
        9 months after the end of the renewal date
    */
    const maxDate = new Date(extCirc.renewalDate);
    maxDate.setMonth(maxDate.getMonth() + 9);
    const extendUntil = this.validator.getQuestionByShortname(extCirc.form, 'extend_until');
    extendUntil.min = new Date(extCirc.renewalDate);
    new Date(extendUntil.min.setDate(extendUntil.min.getDate()+1));
    if(new Date(extendUntil.min).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0)) {
      let minDate = new Date();
      extendUntil.min = new Date(minDate.setDate(minDate.getDate()+1));
    }
    extendUntil.max = maxDate;
  }

  checkLoadCompleted() {
    for (const key in this.extenuatingCircumstances) {
      if (!this.validator.forms.find(form => form.id === key)) {
        return;
      }
    }
   this.loadComplete();
  }

  get selectedYearString() {
    switch (this.selectedYear) {
      case this.lastYear:
        return 'last';
      case this.nextYear:
        return 'next';
      default:
        return 'current';
    }
  }


  exit() {
    this.router.navigate(['/revalidation']);
  }

  submit() {
    this.submitting = true;
    this.serverErrors = [];
    if (this.extenuatingCircumstance.form.completed) {
      this.service.saveExtenuatingCircumstances(this.getPayload()).subscribe(result => {
        this.extenuatingCircumstance.id = result.id;
        this.service.submitExtenuatingCircumstances(result.id).subscribe(submitted => {
          this.extenuatingCircumstance.referenceNumber = submitted.referenceNumber;
          this.submitting = false;
          this.submitted = true;
          this.showSubmittedDialog();
        });
      }, error => {
        if (error.validationErrors) {
          this.serverErrors = error.validationErrors;
        }
      });
    }
  }

  getPayload() {
    this.extenuatingCircumstance.answers = this.validator.getAnswers(this.extenuatingCircumstance.form).answers;
    const payload = Object.assign({}, this.extenuatingCircumstance);
    delete payload.form;
    return payload;
  }

  save() {
    this.saving = true;
    this.serverErrors = [];
    this.service.saveExtenuatingCircumstances(this.getPayload()).subscribe(result => {
      this.extenuatingCircumstance.id = result.id;
      this.saving = false;
    }, error => {
      if (error.validationErrors) {
        this.serverErrors = error.validationErrors;
      }
    });
  }



  showSubmittedDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
        allowCancel: false,
        confirmText: 'OK',
        title: `Form submitted`,
        message: `<p >
        <b>Request reference: ${this.extenuatingCircumstance.referenceNumber}</b></p>
        <p>
        Thank you for submitting an exceptional circumstances request form.
        We will consider your request and contact you to let you know if we are satisfied with
        your reasons and the changes you have requested,
        or if we need to discuss the matter further.</p>
        <p style="font-size:0.7em">If you do not receive a response from us within 28 working days of submitting your form,
        please contact us at info@pharmacyregulation.org.
        </p>`
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/revalidation']);
    });
  }



}
