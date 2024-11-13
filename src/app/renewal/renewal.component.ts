import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ErrorHandler, Renderer2 } from '@angular/core';
import { RenewalService } from '../core/service/renewal.service';
import { Renewal } from './model/Renewal';
import { LayoutService } from '../core/service/layout.service';
import { FormValidator } from '../dynamic/service/FormValidator';
import { Form } from '../dynamic/model/Form';
import { FormValidationService } from '../dynamic/service/formValidationService';
import { WorldpayConfig } from './model/WorldpayConfig';
import { WorldpayCartId } from './model/WorldpayCartId';
import { RenewalPaymentMethod } from './model/RenewalPaymentMethod';
import { CanComponentDeactivate } from '../guard/CanDeactivate.guard';
import { Observable } from 'rxjs/internal/Observable';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirmDialog.component';
import { CustomErrorHandler } from '../core/service/CustomErrorHandler';
import { TrackingService } from '../core/service/tracking.service';
import { UserActivity } from '../core/model/UserActivity';
import { ValidationError } from '../core/model/ValidationError';
import { LogService } from '../core/service/log.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-renew',
  moduleId: module.id,
  templateUrl: './renewal.component.html',
  styleUrls: ['./renewal.scss'],
  providers: [
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService },
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ]
})
export class RenewalComponent implements OnInit, CanComponentDeactivate {

  renewal: Renewal;
  steps;
  step;
  started = false;
  loading = false;
  failed = false;
  saving = false;
  worldpayConfig: WorldpayConfig;
  cartId: string;
  selectedCard = '';
  @ViewChild('worldpayForm') worldpayForm: ElementRef;
  RenewalPaymentMethod = RenewalPaymentMethod;
  showWorldpayDisabledMessage = false;

  constructor(private service: RenewalService,
    private validator: FormValidationService,
    private layout: LayoutService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private tracking: TrackingService,
    private log: LogService
  ) { }

  ngOnInit() {
    this.load();
    this.service.getWordpayConfig().subscribe(config => {
      this.worldpayConfig = config;
    });
  }

  warnForDirty(): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Renewal in progress`,
        message: `<p>If you leave this page without completing your declarations,
         you will have to start from the beginning again.</p>
         <p>Are you sure you want to leave ?</p>`
      }
    });
    return dialogRef.afterClosed();
  }

  canDeactivate() {
    if (!this.inProgress) { return true; }
    return this.warnForDirty();
  }

  get inProgress() {
    return (this.step > 0 && !this.currentStep.completed);
  }

  failTest() {
    this.service.failTest().subscribe(result => {
      console.log(result, 'result');
    },
      error => {
        console.log(error, 'error');
      });
  }

  load() {
    this.loading = true;
    this.failed = false;
    this.service.getRenewal()
      .subscribe(renewal => {
        this.renewal = renewal;
        if (renewal.isDue) {
          this.loadFormTemplates();
        } else {
          this.steps = [{ start: true }];
          this.step = 0;
          this.loading = false;
          this.configureUi();
        }
      }, error => {
        this.loading = false;
        this.failed = true;
      });
  }

  loadFormTemplates() {
    this.service.getFormTemplates().subscribe(formTemplates => {
      this.steps = [{ start: true }];
      formTemplates.forEach(formTemplate => {
        this.steps.push({
          name: formTemplate.formTitle,
          form: true,
          dynamicFormId: this.validator.addForm(formTemplate).dynamicFormId
        });
      });
      this.steps.push({ payment: true });
      if (this.renewal.paymentMethod !== RenewalPaymentMethod.PaymentCard) {
        this.steps.push({ completed: true });
      }
      this.step = 0;
      this.loading = false;
      this.configureUi();
    }, error => {
      this.loading = false;
      this.failed = true;
    });
  }

  get form(): Form {
    if (!this.currentStep.form) {
      return undefined;
    }
    return this.validator.getForm(this.steps[this.step].dynamicFormId);
  }

  get currentStep() {
    if (!this.steps) {
      return undefined;
    }
    return this.steps[this.step];
  }

  allowNext() {
    if (this.currentStep.form) {
      return this.form.completed;
    }
    if (this.currentStep.payment) {
      if (this.showWorldpayDisabledMessage) {
        return false;
      }
      return this.renewal.agreed;
    }
  }

  next() {
    if (this.currentStep.payment) {
      if (this.renewal.paymentMethod === RenewalPaymentMethod.PaymentCard) {
        this.saveDeclarationAndPaymentSelection();
      } else {
        this.saveDeclaration();
      }
    } else {
      this.step++;
      this.configureUi();
    }
  }

  configureUi() {
    setTimeout(() => {
      this.started = this.step > 0;
    });

    if (this.step === 0) {
      this.tracking.postActivity(UserActivity.Renewal, 'Splash page (not started)').subscribe();
    } else {
      if (this.currentStep.payment) {
        this.tracking.postActivity(UserActivity.Renewal, 'Declaration agreement').subscribe();
      }
      if (this.currentStep.form) {
        this.tracking.postActivity(UserActivity.Renewal, `${this.form.formTitle} (step ${this.step})`).subscribe();
      }
    }

    // TODO: window should be abstracted
    window.scrollTo(0, 0);
  }

  prev() {
    this.step--;
    this.configureUi();
  }

  saveDeclaration() {
    this.saving = true;
    const payload = {
      declarations: this.validator.getPayload(),
      confirmedAgreement: this.renewal.agreed
    };

    this.tracking.postActivity(UserActivity.Renewal, 'Declaration save (end of flow)').subscribe(() => {
      this.service.saveDeclaration(payload).subscribe(cartId => {
        this.saving = false;
        this.step++;
        // TODO: window should be abstracted
        window.scrollTo(0, 0);
      }, error => {
        this.handleValidationErrors(error);
        this.saving = false;
      });
    }, error => {
      this.handleValidationErrors(error);
      this.saving = false;
    });
  }

  handleValidationErrors(error) {

    if (!error) { return; }
    const validationErrors: Array<ValidationError> = error.validationErrors;
    if (validationErrors && validationErrors.length) {
      let errorMessage = '';
      validationErrors.forEach(e => {
        errorMessage += e.errors.join(', ');
      });
      this.log.flag(this.log.error(errorMessage));
    }

  }

  saveDeclarationAndPaymentSelection() {
    this.saving = true;
    const payload = {
      declarations: this.validator.getPayload(),
      paymentDetails: {
        selectedCard: this.renewal.selectedCard
      },
      confirmedAgreement: this.renewal.agreed
    };

    this.tracking.postActivity(UserActivity.Renewal, 'Declaration save & worldpay redirect (end of flow)').subscribe(() => {
      this.service.saveDeclaration(payload).subscribe(renewalResponse => {
        const worldpayUrl = renewalResponse.worldpayUrl;
        window.location.href = worldpayUrl;
      }, error => {
        this.handleValidationErrors(error);
        this.saving = false;
      });
    }, error => {
      this.handleValidationErrors(error);
      this.saving = false;
    });
  }
}
