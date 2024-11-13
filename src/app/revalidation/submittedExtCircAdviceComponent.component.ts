import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Registrant } from '../registration/model/Registrant';
import { AuthService } from '../core/service/auth.service';
import { DatePipe } from '@angular/common';
import { RevalidationService } from '../core/service/revalidation.service';
import { ExtenuatingCircumstance } from '../shared/model/revalidation/ExtenuatingCircumstance';
import { ExtCircReview } from '../shared/model/revalidation/ExtCircReview';
import { ExtenuatingCircumstanceReviewDecision } from '../shared/model/revalidation/ExtenuatingCircumstanceReviewDecision';
import { ExtCircType } from '../shared/model/revalidation/ExtCircType';

@Component({
  moduleId: module.id,
  templateUrl: './SubmittedExtCircAdviceComponent.component.html',
  styleUrls: ['./submittedExtCircAdvice.scss']
})
export class SubmittedExtCircAdviceComponent implements OnInit {
  registrantStartDate: any;
  registrant: Registrant;
  id;
  extCirc: ExtenuatingCircumstance;
  review: ExtCircReview;
  loading = false;
  failed = false;
  type: ExtCircType;
  Decision = ExtenuatingCircumstanceReviewDecision;
  ExtCircType = ExtCircType;

  get isReduction() {
    return this.type === ExtCircType.Reduction;
  }

  get isExtension() {
    return this.type === ExtCircType.Extension;
  }

  get year() {
    return new Date(this.extCirc.renewalDate).getFullYear();
  }

  get submissionDeadline() {
    return this.extCirc.review.submissionDeadline;
  }

  constructor(private service: RevalidationService,
    private router: Router,
    private dialog: MatDialog,
    private auth: AuthService,
    private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
    this.type = parseInt(this.route.snapshot.params['type'], 10);
  }

  ngOnInit() {
    this.loading = true;
    this.registrant = this.auth.user.registrant;
    this.service.getExtenuatingCircumstance(this.id)
      .subscribe(extentuatingCirc => {
        this.extCirc = extentuatingCirc;
        this.loading = false;
      });
  }


  print() {
    (<any>window).print();
  }

  exit() {
    this.router.navigate([`/revalidation/exceptional-circumstances/${this.id}`]);
  }

}
