
import {throwError as observableThrowError} from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter, ViewChildren } from '@angular/core';
import { AccountService } from '../service/account.service';
import { StudentService } from '../../core/service/student.service';
import { User } from '../model/User';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirmDialog.component';
import { AuthService } from '../../core/service/auth.service';
import { LogService } from '../../core/service/log.service';
import { Observable } from 'rxjs/internal/Observable';


import { PreregActivation } from './model/PreregActivation';
import { Qualification } from '../../shared/model/student/Qualification';
import { CourseType } from '../../shared/model/student/CourseType';

import utils from '../../core/service/utils';

@Component({
  moduleId: module.id,
  selector: 'app-prereg-activation',
  templateUrl: './PreregActivation.component.html',
  styleUrls: ['./accountActivation.scss']
})
export class PreregActivationComponent implements OnInit {

  activationFailed = false;
  loading = false;
  saving = false;
  @Input() activation: PreregActivation;
  @Input() set active(isActive) {
    if (isActive) {
      this.setFocus();
    }
  }

  CourseType = CourseType;
  courseTypes = [];
  selectedCourseType;
  coursesForSelectedCourseType = [];

  qualifications: Array<Qualification> = [];
  @Input() step = 1;
  @Output() stepChange = new EventEmitter<number>();
  invalidDetails = false;

  @ViewChildren('focus') vc;

  serverErrors = [];

  constructor(private service: AccountService, private studentService: StudentService,
    private auth: AuthService, private dialog: MatDialog, private log: LogService) {
  }

  dobSelected(dob) {
    this.activation.dob = dob;
  }
  prev() {
    this.stepChange.emit(this.step - 1);
  }

  ngOnInit() {
    this.courseTypes = Object.keys(CourseType)
      .filter(key => typeof CourseType[key] !== 'number')
      .map(key => ({
        value: (CourseType[key] === 'MPharmS') ?
          'MPharm (integrated / sandwich)' : CourseType[key], key: parseInt(key, 10)
      }));

    this.setFocus();
    this.studentService.getQualifications().subscribe(qualifications => {
      this.qualifications = qualifications;
    });
  }

  populateCourses() {
    this.activation.qualificationId = 0;
    if (this.selectedCourseType && this.selectedCourseType !== 'undefined') {
      this.coursesForSelectedCourseType = this.qualifications
      .filter(q => q.courseType === this.selectedCourseType.key)
      .sort((a, b) => {
        if (a > b) { return 1; } else { return -1; }
      });
    }

  }

  setFocus() {
    setTimeout(function () {
      if (this.vc.first) {
        this.vc.first.nativeElement.focus();
      }
    }.bind(this), 600);
  }

  activate() {
    this.loading = true;
    this.invalidDetails = false;

    this.service.verifyPrereg(this.activation).subscribe(data => {
      this.confirm(data.fullName).beforeClosed().subscribe(response => {
        if(!response) { this.loading = false; return false;}
        this.activatePrereg();
      })
    }, error => {
      this.loading = false;
      this.serverErrors = error.validationErrors;
      this.activationFailed = true;
    });


  }

  activatePrereg() {
    this.service.activatePrereg(this.activation).catch(response => {
      setTimeout(() => {
        this.loading = false;
        this.activationFailed = true;
        this.invalidDetails = true;
        if (response.status === 400 && response.validationErrors) {
          this.serverErrors = response.validationErrors;
        }
        this.setFocus();
      }, 300);
      return observableThrowError(response);
    }).subscribe(() => {
      this.loading = false;
      this.stepChange.emit(2);
    });
  }

  confirm(fullname) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Confirm user details`,
        message: `
        <p>You will be logged in as:</p>
        <p>${fullname}</p>
        <p><b>Please select yes if you are happy with the supplied details.</b></p>
        `
      }
    });
    return dialogRef;
  }

  logout() {
    this.auth.logout();
  }

}
