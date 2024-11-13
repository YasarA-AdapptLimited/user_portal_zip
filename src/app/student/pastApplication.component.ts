import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../core/service/auth.service';
import { Applicant } from '../account/model/Applicant';
import { StudentService } from '../core/service/student.service';
import { User } from '../account/model/User';
import { ActivatedRoute } from '@angular/router';
import { PreregApplication } from '../shared/model/student/PreregApplication';
import { AttachmentType } from '../shared/model/AttachmentType';

@Component({
  moduleId: module.id,
  templateUrl: './pastApplication.component.html',
  styleUrls: ['../registration/countersign.scss']
})
export class PastApplicationComponent implements OnInit  {


  loading = false;
  formId;
  application;
  applicationForm: PreregApplication;
  attachments;
  AttachmentType = AttachmentType;
  applicationDate;

  constructor(private auth: AuthService, private service: StudentService, private route: ActivatedRoute) {
    this.formId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.loading = true;
    this.service.getApplication(null).subscribe(application => {
      this.application = application;
      this.applicationForm = application;
      this.applicationDate = this.application.pastApplications
       .find(app => app.id === this.formId);
      this.loading = false;
    }, error => {
      this.loading = false;
    });

  }
}
