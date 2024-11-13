import { Component, OnInit, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { RevalidationService } from './service/revalidation.service';
import { RevalidationLogic } from '../shared/service/revalidation/revalidationLogic.service';
import { RenewalService } from './service/renewal.service';
import { Renewal } from '../renewal/model/Renewal';
import { Registrant } from '../registration/model/Registrant';
import { RegistrantStatus } from '../registration/model/RegistrantStatus';
import { RegistrantType } from '../registration/model/RegistrantType';
import { LogService } from './service/log.service';
import { LayoutService } from './service/layout.service';

@Component({
  selector: 'app-reviewer-dashboard',
  moduleId: module.id,
  templateUrl: './reviewerDashboard.component.html',
  styleUrls: ['../style/dashboard.scss'],
  providers: [
    RevalidationLogic
  ]
})
export class ReviewerDashboardComponent implements OnInit {


  user;
  constructor(private auth: AuthService) {


  }

  ngOnInit() {
    this.user = this.auth.user;
  }



}
