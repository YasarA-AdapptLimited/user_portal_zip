import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../core/service/review.service';
import { ReviewSummary } from './model/ReviewSummary';
import { ReviewStage } from './model/ReviewStage';
import { Router, ActivatedRoute } from '@angular/router';
import { DevService } from '../core/service/dev.service';
import { LayoutService } from '../core/service/layout.service';
import { trigger, transition, animate, style } from '@angular/animations';
@Component({

  templateUrl: './reviewSummaryList.component.html',
  styleUrls: ['./reviewSummaryList.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({
          transform: 'translateY(5px)',
          opacity: 1
        }),
        animate('400ms cubic-bezier(0, 0, 0.2, 1)',
          style({
            transform: 'translateY(0)',
            opacity: 1
          }))
      ])
    ])
  ]
})
export class ReviewSummaryListComponent implements OnInit {

  summary;
  items;
  grouping;
  loading = false;
  ReviewStage = ReviewStage;
  reviewDeadline;
  reviewStage;

  constructor(private _router: Router, private activatedRoute: ActivatedRoute,
    private service: ReviewService, private dev: DevService, private layout: LayoutService) {

    this.reviewDeadline = activatedRoute.snapshot.params['deadline'];
    this.reviewStage = activatedRoute.snapshot.params['stage'];


  }


  exit() {
    this._router.navigate(['./review']);
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.service.getReviewSummary().subscribe(summary => {

      this.summary = summary;

      this.grouping = summary.deadlineGroupings
        .find(g => g.deadline === this.reviewDeadline);

      this.setItems();
      this.loading = false;
    });
  }

  select(stage) {
    if (this.grouping.counts.find(c => c.key === stage).items.length) {
      this.reviewStage = stage;
      this.setItems();
    }

  }

  setItems() {
    this.items = undefined;
    setTimeout(() => {
      this.items = this.grouping.counts
        .find(c => c.key === this.reviewStage)
        .items
        .map(item => {
          item.completed = item.stage > 4 || (item.stage === ReviewStage.Annotate &&
          (item.isLead && item.leadReviewerAssessment || !item.isLead && item.reviewerAssessment));
          return item;
        }).sort((a, b) => {
          if (a.stage > 4 && b.stage <= 4) {
            return 1;
          }
          return -1;
        });
    });

  }



}
