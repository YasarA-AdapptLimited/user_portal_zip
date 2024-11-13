import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { DatePipe } from '@angular/common';
import { AssessmentApproveLetterData } from '../../model/AssessmentApproveLetterData';
import { Registrant } from '../../model/Registrant';
import { RegistrationService } from '../../../core/service/registration.service';
import { LetterType } from '../../model/LetterType';
@Component({
  selector: 'app-assessment-third-attempt-fail-letter',
  moduleId: module.id,
  templateUrl: './assessmentThirdAttemptFailLetter.component.html',
  styleUrls: ['../letter.scss']
})
export class AssessmentThirdAttemptFailLetterComponent implements OnInit {

  registrantStartDate: any;
  registrant: Registrant;
  assessmentApproveData: AssessmentApproveLetterData;
  registrantAddress: any;
  isPharmacist: boolean;
  isPharmacyTechnician: boolean;
  loading = false;
  failed = false;
  receipt;
  user;
  currentDate;

  DateOfResults;
  PreEntryID;
  DateOfAssessment;
  Part1Outcome;
  Part1PassMark;
  Part1CandidateMark;
  Part2Outcome;
  Part2PassMark;
  Part2CandidateMark;


  @Input() isRegistrant = false;
  registrantName: string;
  letterDate: any;
  CandidateNumber: any;
  id: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthService,
    private date: DatePipe,
    private service: RegistrationService,
  ) { this.id = this.route.snapshot.params['id']; }

  ngOnInit() {
    this.currentDate = new Date();

    this.registrantName = this.auth.user.title + ' ' + this.auth.user.surname;
    this.registrant = this.auth.user.registrant;
    this.registrantAddress = this.auth.user.address;

    this.service.getLetters().subscribe(letters => {

      const letter = letters.find(l => l.id === this.id);
      this.CandidateNumber = letter.data.CandidateNumber;
      this.DateOfResults = letter.data.DateOfResults;
      this.PreEntryID = letter.data.PreEntryID;
      this.DateOfAssessment = letter.data.DateOfAssessment;
      this.Part1Outcome = letter.data.Part1Outcome;
      this.Part1PassMark = letter.data.Part1PassMark;
      this.Part1CandidateMark = letter.data.Part1CandidateMark;
      this.Part2Outcome = letter.data.Part2Outcome;
      this.Part2PassMark = letter.data.Part2PassMark;
      this.Part2CandidateMark = letter.data.Part2CandidateMark;

    });
    if (this.auth.user.isPrereg) {
      this.registrant = this.auth.user.registrant;
    } else {
      this.registrant = this.auth.user.registrant;
    }
  }

  print() {
    (<any>window).print();
  }

  exit() {
    if (this.auth.user.isPrereg) {
      this.router.navigate(['/account/notifications']);
    } else {
      this.router.navigate(['/home']);
    }

  }

}
