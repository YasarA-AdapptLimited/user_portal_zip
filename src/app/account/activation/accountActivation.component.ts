import { Component, OnInit, Inject } from '@angular/core';
import { ActivationType } from './model/ActivationType';
import { LayoutService } from '../../core/service/layout.service';
import { TechnicianActivation } from './model/TechnicianActivation';
import { LogService } from '../../core/service/log.service';

@Component({
  moduleId: module.id,
  templateUrl: './accountActivation.component.html',
  styleUrls: ['./accountActivation.scss']
})
export class AccountActivationComponent implements OnInit {

  ActivationType = ActivationType;
  selectedRole;
  currentStep;
  activation: any;
  steps = [0, 1, 2, 3, 4];
  preregActivationDisabled = false;

  constructor(private layout: LayoutService) { }

  ngOnInit() {
    this.layout.setAccountMode(true);
  }

  navigateTo(step) {
    this.currentStep = step;
    if (step === 0) {
      this.selectedRole = undefined;
    }
  }
  /*
    setPreregActivationDisabled() {
      // disabled between 3pm on 25th June until 7am on 2nd July
      // NB months are zero-indexed
      const disabledFrom = new Date(2018, 5, 25, 15);
      const disabledTo = new Date(2018, 6, 2, 7);
      const now = new Date();

      this.preregActivationDisabled = now > disabledFrom && now < disabledTo;
      this.log.info('prereg activation disabled from', disabledFrom.toString());
      this.log.info('prereg activation disabled to', disabledTo.toString());
      this.log.info('now', now.toString());
      this.log.info('prereg activation disabled ?', this.preregActivationDisabled);
    }
  */
  selectRole(role: ActivationType) {
    this.selectedRole = role;
    switch (role) {
      case ActivationType.Technician:
        this.activation  =   {
          forenames: '',
          surname: '',
          middleName: '',
          dob: ''
        };
        break;
      case ActivationType.Registrant:
        this.activation = {
          registrationNumber: '',
          name: '',
          confirmed: false,
          dob: '',
          postcode: '',
          activationCode: ''
        };
        break;
      case ActivationType.Prereg:
        this.activation = {
          lastname: '',
          dob: '',
          qualification: undefined
        };
        break;
      case ActivationType.Student:
        this.activation = {
          lastname: '',
          dob: '',
          qualification: undefined
        };
    }
    this.currentStep = 1;
  }

}
