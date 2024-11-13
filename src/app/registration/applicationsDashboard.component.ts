import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { Registrant } from './model/Registrant';
import { RegistrantStatus } from './model/RegistrantStatus';
import { RegistrantType } from './model/RegistrantType';
import { IndependentPrescriberApplication } from './independent-precriber/model/IndependentPrescriberApplication';
import { User } from '../account/model/User';
import { ApplicationStatus } from '../prereg/model/ApplicationStatus';
import { RegistrationService } from '../core/service/registration.service';
import { ApplicationDetails } from './model/ApplicationDetails';

@Component({
  selector: 'app-applications-dashboard',
  moduleId: module.id,
  templateUrl: './applicationsDashboard.component.html',
  styleUrls: ['../style/dashboard.scss']
})
export class ApplicationsDashboardComponent implements OnInit {

  user: User;
  registrant: Registrant;
  name: string;
  RegistrantStatus = RegistrantStatus;
  RegistrantType = RegistrantType;
  independentPrescriberApplication: IndependentPrescriberApplication;
  ApplicationStatus = ApplicationStatus;
  loadingIPApplication = true;
  loadingVRapplication = true;
  loadingApplications = true;
  error = false;
  applicationClosed;
  returnToRegisterApplication;
  ccpsRegulatoryBodiesSelected = [];

  applications: Array<{ header: string, status: ApplicationStatus, link: string, loading: boolean, regulatoryBodyName?: string, isCCPSApplication: boolean }> = [];

  constructor(private _router: Router, private auth: AuthService, 
    private registrationService: RegistrationService ) { }

  ngOnInit() {
      this.user = this.auth.user;
      this.loadApplications();
    }

  loadApplications() {
    if(this.user.registrant) {
      this.registrationService.getAvailableForms().subscribe((details: ApplicationDetails) => {
        if(!details) return;
        if( details.isVRAppAvailable ) {
          this.applications.push({
            header: 'Voluntary removal of your register entry',
            status: details.voluntaryRemovalFormStatus ? details.voluntaryRemovalFormStatus : ApplicationStatus.NotStarted,
            link: '/voluntaryRemoval/application',
            loading: false,
            isCCPSApplication: false
          });
        }

        if( details.isIndyPrescAppAvailable ) {
          this.applications.push({
            header: 'Independent prescriber application',
            status: details.indyPrescriberFormStatus ? details.indyPrescriberFormStatus : ApplicationStatus.NotStarted,
            link: '/independentPrescriber/application',
            loading: false,
            isCCPSApplication: false
          });
        }

        if( details.isCPSCAppAvailable ) {
          this.applications.push({
            header: 'Certificate of current professional status & fitness to practice history',
            status: ApplicationStatus.NotStarted,
            link: '/ccps/application',
            loading: false,
            isCCPSApplication: true
          });
          // formId of a new application will be known only after making a ccps post call.
          localStorage.setItem('ccpsFormActive',JSON.stringify('noFormIdYet'));
        }

        details.cpscFormsDetails?.forEach( (form, index) => {

          this.applications.push({
              header: 'Certificate of current professional status & fitness to practice history',
              status: form?.formStatus ? form.formStatus : ApplicationStatus.NotStarted,
              link: (details.isCPSCAppAvailable && form.formStatus === ApplicationStatus.NotStarted) ? '/ccps/application': '/ccps/application/'+form.formId,
              loading: false,
              regulatoryBodyName: form.regulatoryBodyName,
              isCCPSApplication: true
          });

          this.ccpsRegulatoryBodiesSelected.push({
            formId: form.formId,
            regulatoryBodyId: form.regulatoryBodyId
          });
        });

        localStorage.setItem('ccpsFormDetails', JSON.stringify(this.ccpsRegulatoryBodiesSelected));

        this.loadingApplications = false;
      }, error => {
        this.loadingApplications = false;
      });
      ;
    }
  }
}
