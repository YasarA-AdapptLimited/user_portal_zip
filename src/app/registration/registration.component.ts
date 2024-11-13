import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../core/service/auth.service';
import { Registrant } from './model/Registrant';
import { RegistrantStatus } from './model/RegistrantStatus';
import { RegistrantType } from './model/RegistrantType';
import { PreregService } from '../core/service/prereg.service';
import { CaseSplitPipe } from '../shared/pipe/CaseSplit.pipe';
import { LetterType } from './model/LetterType';
import { RegistrationService } from '../core/service/registration.service';
import { environment } from '../../environments/environment';
import { RTREligibilityType } from './model/RTREligibilityType';

@Component({
  moduleId: module.id,
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.scss']
})
export class RegistrationComponent implements OnInit {

  registrant: Registrant;
  RegistrantStatus = RegistrantStatus;
  registrantType;

  loadingCountersigs = false;
  countersigs;
  loadingLetters = false;
  letters = [];
  loadingLearningContracts = false;
  learningContracts = [];

  LetterType = LetterType;
  showNoticeOfEntry;
  isDev = false;
  isRTRApplicationAvailable : RTREligibilityType;
  renewalDate;
  expiryDate;
  annotation;
  constructor(private auth: AuthService, private preregService: PreregService,
    private caseSplit: CaseSplitPipe, private regService: RegistrationService) { }

  ngOnInit() {
    this.isDev = !!environment.dev;
    this.registrant = this.auth.user.registrant;
    this.expiryDate = this.registrant.expiryDate;
    this.renewalDate = this.registrant.renewalDate;
    this.annotation = this.registrant.prescriberStatuses;
    this.isRTRApplicationAvailable = this.registrant.isRTRAppAvailable;
    this.showNoticeOfEntry = this.auth.user.showNoticeOfEntry;
    this.registrantType = this.caseSplit.transform(RegistrantType[this.registrant.type]);
    this.loadingCountersigs = true;
    this.preregService.getCountersignatureRequests(this.registrant.registrationNumber).subscribe(s => {
      this.countersigs = s;
      this.loadingCountersigs = false;
    });

    this.loadLetters();
    this.loadLearningContracts();
    if (this.isRTRApplicationAvailable !== 0) {
      this.expiryDate = '';
      this.renewalDate = '';
      this.annotation = '';
    }

  }

  createLetters() {
    if (this.isDev) {
      this.regService.createLetters().subscribe(() => {
        this.loadLetters();
      });
    }
  }

  loadLetters() {

    this.loadingLetters = true;
    this.regService.getLetters().subscribe(letters => {
      this.loadingLetters = false;
      this.letters = letters;
    });

  }

  loadLearningContracts() {
    this.loadingLearningContracts = true;
    this.regService.getLearningContracts().subscribe(lc => {
      if (!lc) {
        this.loadingLearningContracts = false;
      } else {
        this.learningContracts = lc;
        this.loadingLearningContracts = false;
      }
    });
  }

}