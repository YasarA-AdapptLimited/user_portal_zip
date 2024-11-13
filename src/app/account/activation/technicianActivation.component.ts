import { Component, Input, Output, EventEmitter, ViewChildren } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { Qualification } from '../../shared/model/student/Qualification';
import { TechnicianActivation } from './model/TechnicianActivation';
import { TechnicianService } from '../../core/service/technician.service';
import { throwError } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'app-technician-activation',
  templateUrl: './technicianActivation.component.html',
  styleUrls: ['./accountActivation.scss']
})
export class TechnicianActivationComponent {


  activationFailed = false;
  loading = false;
  saving = false;
  @Input() activation: TechnicianActivation;
  @Input() set active(isActive) {
    if (isActive) {
      this.setFocus();
    }
  }

  qualifications: Array<Qualification> = [];
  @Input() step = 1;
  @Output() stepChange = new EventEmitter<number>();
  invalidDetails = false;

  @ViewChildren('focus') vc;

  serverErrors = [];

  constructor(private auth: AuthService,
    private service: TechnicianService
    ) {}

  dobSelected(dob) {
    this.activation.dob = dob;
  }

  setFocus() {
    setTimeout(function () {
      if (this.vc.first) {
        this.vc.first.nativeElement.focus();
      }
    }.bind(this), 600);
  }


  tempSignUp() {
    this.loading = true;
    this.service.tempSignUp(this.activation)
    .subscribe(() => {
      this.loading = false;
      this.stepChange.emit(2);
    },
    (error) => {
      setTimeout(() => {
        this.loading = false;
        this.activationFailed = true;
        this.invalidDetails = true;
        if (error.status === 400 && error.validationErrors) {
          this.serverErrors = error.validationErrors;
        }
        this.setFocus();
      }, 300);
      return throwError(error);
    });



  }

  logout() {
    this.auth.logout();
  }

  prev() {
    this.stepChange.emit(this.step - 1);
  }

}
