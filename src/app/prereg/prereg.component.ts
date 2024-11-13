import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../core/service/auth.service';
import { Applicant } from '../account/model/Applicant';
import { User } from '../account/model/User';
import { CurrentApplicationService } from '../core/service/prereg/currentApplication.service';
import { LetterType } from '../registration/model/LetterType';
import { RegistrationService } from '../core/service/registration.service';
import { AssessmentAttemptsLetterData } from '../registration/model/AssessmentAttemptsLetterData';
@Component({
  moduleId: module.id,
  templateUrl: './prereg.component.html'
})
export class PreregComponent implements OnInit {

  trainee: Applicant;
  user: User;
  loading;
  LetterType = LetterType;
  loadingLetters = false;
  letters = [];
  letterType;
  Sitting: number;
  finalSitting: number;

  constructor(private auth: AuthService, private currentApplicationService: CurrentApplicationService,
    private regService: RegistrationService) { }

  ngOnInit() {
    this.user = this.auth.user;
    this.trainee = this.currentApplicationService.trainee.value;
    this.loadLetters();
  }
  loadLetters() {
    this.loadingLetters = true;
    this.regService.getLetters().subscribe(letters => {
      this.loadingLetters = false;
      this.letters = letters;
    });

  }

}
