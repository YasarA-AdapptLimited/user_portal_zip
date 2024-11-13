import { Component, OnInit, Input, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { Address } from '../../account/model/Address';
import { User } from '../../account/model/User';
import { NgForm } from '@angular/forms';
import { Tooltip } from './../../core/tooltip/Tooltip';
import { IndependentPrescriberApplication } from '../independent-precriber/model/IndependentPrescriberApplication';
import { CountersignatureOutcome } from '../../technician/model/CountersignatureOutcome';
import { IndependentPrescriberService } from '../../core/service/independentPrescriber.service';
import { IndependentPrescriberData } from '../model/IndependentPrescriberData';

@Component({
  moduleId: module.id,
  selector: 'app-independent-prescriber-countersign-response',
  templateUrl: './independentPrescriberMentorCountersignin.component.html',
  styleUrls: ['../countersign.scss']
})
export class IndependentPrescriberMentorCountersigninComponent implements OnInit {

  @ViewChild('form') countersignForm: NgForm;
  @ViewChildren('formInput') allInputs: QueryList<any>;
   @Input() application: IndependentPrescriberData;
  id: string;
  date: string;
  name: string;
  loading = false;
  CountersignatureOutcome = CountersignatureOutcome;
  response;
  responseReason;
  role: number;
  submitting = false;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  }
  showDetailsHelp = false;
  validationErrors: any;
  user : User
  validInputs: boolean;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private IndependentPrescriberService: IndependentPrescriberService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.date = this.route.snapshot.params['date'];
    this.role = +this.route.snapshot.params['role'];
  }

  ngOnInit(): void {
    this.user = this.auth.user;
  }

  print(): void {
    (<any>window).print();
  }

  exit(): void {
    this.router.navigate(['/registration']);
  }

  focusOnInvalidInputs(): void {
    this
      .allInputs
      .filter(input => input.nativeElement.className.includes('ng-invalid'))
      .forEach(input => input.nativeElement.focus());
  }

  submitOutcome(formValue): void {
    this.submitting = true;
    const outcome = {
      id: this.id,
      decision: this.response,
      feedback: this.responseReason,
      countersignerComment: formValue
    };
    const submitOutcome = (anoutcome = outcome): void => {
      this.submitting = false;
      this.validInputs = true;
      this.IndependentPrescriberService.submitCountersignatureOutcome(anoutcome).subscribe(() => {
        this.submitting = true;
        this.exit();
      }, () => {
        this.submitting = false;
        this.validInputs = false;
      });
    };

    if (this.response === CountersignatureOutcome.Refused) {
      this.validInputs = true;
      outcome['countersignerComment'] = '';
      submitOutcome(outcome);
    }

    if (this.response === CountersignatureOutcome.Approved ||
      this.response === CountersignatureOutcome.Rejected
    ) {
      (this.countersignForm.invalid) ? this.focusOnInvalidInputs() : submitOutcome();
    }
  }

}