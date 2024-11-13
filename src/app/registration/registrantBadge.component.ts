

import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../core/service/auth.service';
import { Registrant } from './model/Registrant';
import { RegistrantStatus } from './model/RegistrantStatus';
import { RegistrantType } from './model/RegistrantType';

@Component({
  selector: 'app-registrant-badge',
  moduleId: module.id,
  templateUrl: './registrantBadge.component.html'
})
export class RegistrantBadgeComponent implements OnInit  {


  @Input() link;
  registrant: Registrant;
  RegistrantStatus = RegistrantStatus;
  RegistrantType = RegistrantType;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.registrant = this.auth.user.registrant;
  }

}
