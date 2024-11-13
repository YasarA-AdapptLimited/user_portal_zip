import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../core/service/auth.service';
import { Applicant } from '../account/model/Applicant';
import { PreregService } from '../core/service/prereg.service';
import { User } from '../account/model/User';
import { ActivatedRoute } from '@angular/router';
import { RegApplicationForm } from './model/RegApplicationForm';
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
  applicationForm: RegApplicationForm;
  attachments;
  AttachmentType = AttachmentType;
  applicationDate;

  constructor(private auth: AuthService, private service: PreregService, private route: ActivatedRoute) {
    this.formId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.loading = true;
    this.service.getRegApplication(null).subscribe(application => {
      this.application = application;
      this.applicationDate = this.application.pastApplications
       .find(app => app.id === this.formId);
      this.loading = false;
    }, error => {
      this.loading = false;
    });

  }
}
