
import {throwError as observableThrowError} from 'rxjs';
import { Component, Input, Output, EventEmitter, OnInit, ViewChildren } from '@angular/core';
import { AccountService } from '../service/account.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/service/auth.service';
import { LogService } from '../../core/service/log.service';
import 'rxjs/add/operator/catch';
import { RegistrantActivation } from './model/RegistrantActivation';

@Component({
  moduleId: module.id,
  selector: 'app-registrant-activation',
  templateUrl: './registrantActivation.component.html',
  styleUrls: ['./accountActivation.scss']
})
export class RegistrantActivationComponent implements OnInit {

  loading = false;

  @Input() activation: RegistrantActivation;
  @Input() set active(isActive) {
    if (isActive) {
      this.setFocus();
    }
  }
  @Input('step') step;
  @Output() stepChange = new EventEmitter<number>();
  @Output() activationChange = new EventEmitter<any>();
  invalidRegistrationNumber = false;
  activationFailed = false;

  @ViewChildren('focus') vc;

  validationErrors = [];

  constructor(private service: AccountService,
    private auth: AuthService, private dialog: MatDialog, private log: LogService) {
  }

  dobSelected(dob) {
    this.activation.dob = dob;
  }

  ngOnInit() {
    this.activationChange.emit(this.activation);
  }

  setFocus() {
    setTimeout(function () {
      if (this.vc.first && this.vc.first.nativeElement) {
        this.vc.first.nativeElement.focus();
      }
    }.bind(this), 600);
  }

  clearErrors() {
    this.invalidRegistrationNumber = false;
    this.validationErrors = [];
  }

  verifyRegistrationNumber() {


    if (!this.activation.registrationNumber) { return; }
    this.loading = true;
    this.invalidRegistrationNumber = false;
    this.service.verifyRegistrationNumber(this.activation.registrationNumber)
      .catch(err => {
        if (err.status === 404) {
          setTimeout(() => {
            this.loading = false;
            this.invalidRegistrationNumber = true;
            this.setFocus();
          }, 100);
        }
        return observableThrowError(err);
      }).subscribe(name => {
        this.activation.name = name;
        this.stepChange.emit(2);
        this.activationChange.emit(this.activation);
        this.loading = false;
        this.setFocus();
      });
  }

  confirm() {
    this.activation.confirmed = true;
    this.setFocus();
    this.stepChange.emit(3);
    this.activationChange.emit(this.activation);
  }

  prev() {
    this.stepChange.emit(this.step - 1);
  }

  incorrect() {
    this.activation.confirmed = false;
    this.stepChange.emit(1);
    this.activation.registrationNumber = '';
    this.activationChange.emit(this.activation);
    this.setFocus();
  }

  activate() {
    this.loading = true;
    this.validationErrors = [];
    this.activationFailed = false;
    this.service.activateRegistration(this.activation).catch(response => {
      setTimeout(() => {
        this.loading = false;
        this.activationFailed = true;
        if (response.status === 400 && response.validationErrors) {
          this.validationErrors = response.validationErrors;
        }
        this.setFocus();
      }, 300);
      return observableThrowError(response);
    }).subscribe(() => {
      this.loading = false;
      this.stepChange.emit(4);
    });
  }

  logout() {
    this.auth.logout();
  }

}
