import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Registrant } from './model/Registrant';
import { AuthService } from '../core/service/auth.service';
import { DatePipe } from '@angular/common';
import { PreregService } from '../core/service/prereg.service';
import { RegApplication } from '../prereg/model/RegApplication';
import { CountersignatureOutcome } from '../prereg/model/CountersignatureOutcome';
import { LearningContractResponse } from '../shared/model/student/LearningContractResponse';
import { RegistrationService } from '../core/service/registration.service';
import { Student } from '../shared/model/student/Student';

@Component({
  moduleId: module.id,
  templateUrl: './learningContractResponse.component.html',
  styleUrls: ['countersign.scss']
})
export class LearningContractResponseComponent implements OnInit {

  id: string;

  loading = false;

  submitClicked;
  submitting;
  response;
  responseReason;
  user;
  LearningContractResponse = LearningContractResponse;
  @ViewChild('responseReasonInput') responseReasonInput: ElementRef;
  studentData;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private regService: RegistrationService
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  setFocus(response) {
    if (response === LearningContractResponse.Rejected) {
      setTimeout(() => { this.responseReasonInput.nativeElement.focus(); }, 1000);
    }
  }

  ngOnInit() {
    this.loading = false;
    this.user = this.auth.user;
    this.regService.getLearningContract(this.id).subscribe(studentData => {
      this.studentData = studentData;
    });

  }

  print() {
    (<any>window).print();
  }

  exit() {
    this.router.navigate(['/registration']);
  }

  submitOutcome() {
    this.submitClicked = true;
    // if (!this.response || (this.response === LearningContractResponse.Rejected && !this.responseReason)) {
    //   this.setFocus(this.response);
    //   // if it is rejected, we still want to send that data to the backend ?
    //   return;
    // }

    const submitLearningContractResponse = () => {
      const payload = {
        formId: this.id,
        decision: this.response,
        feedback: this.responseReason
      };
      this.submitting = true;
      this.regService.submitLearningContractResponse(payload)
        .subscribe(() => {
          this.exit();
        }, error => {
          this.submitting = false;
        });
    };

    const setFocus = () => {
      this.setFocus(this.response);
      return;
    };

    (!this.response) ? setFocus() : submitLearningContractResponse();

  }

}
