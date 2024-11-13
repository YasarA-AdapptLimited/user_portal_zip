import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { DatePipe } from '@angular/common';
import { AssessmentApproveLetterData } from '../model/AssessmentApproveLetterData';
import { Registrant } from '../model/Registrant';
import { RegistrationService } from '../../core/service/registration.service';
import { LetterType } from '../model/LetterType';
@Component({
  selector: 'app-assessment-approve-letter',
  moduleId: module.id,
  templateUrl: './assessmentApproveLetter.component.html',
  styleUrls: ['letter.scss']
})
export class AssessmentApproveLetterComponent implements OnInit {

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


  @Input() isRegistrant = false;
  registrantName: string;
  letterDate: any;
  submissionDeadline: any;
  PreEntryID: any;
  AssessmentDate: any;
  WebLink: any;
  Code: any;
  AssessmentName: any;
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

    this.registrantName = this.auth.user.forenames;
    this.registrant = this.auth.user.registrant;
    this.registrantAddress = this.auth.user.address;

    this.service.getLetters().subscribe(letters => {
      if (this.id === undefined) {
        this.PreEntryID = letters[0].data.PreEntryID;
        this.AssessmentName = letters[0].data.AssessmentName;

      } else {
          const letter = letters.find(l => l.id === this.id);
          this.PreEntryID = letter.data.PreEntryID;
          this.AssessmentName = letter.data.AssessmentName;
      }

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
      this.router.navigate(['/prereg/home']);
    } else {
      this.router.navigate(['/home']);
    }

  }

}
