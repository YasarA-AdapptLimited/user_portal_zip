import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReviewService } from '../core/service/review.service';
import { ReviewSummary } from './model/ReviewSummary';
import { ReviewStage } from './model/ReviewStage';
import { Router } from '@angular/router';
import { DevService } from '../core/service/dev.service';
import { LayoutService } from '../core/service/layout.service';
import { ReviewDeadlineGrouping } from './model/ReviewDeadlineGrouping';
import { trigger, transition, animate, style } from '@angular/animations';
@Component({
  selector: 'app-review-summary',
  moduleId: module.id,
  templateUrl: './reviewSummary.component.html',
  styleUrls: ['./reviewSummary.scss'],
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
export class ReviewSummaryComponent implements OnInit {

  summary: ReviewSummary;
  items;
  loading = false;
  ReviewStage = ReviewStage;
  searchOpen = false;
  searchCriteria = {
    reviewTitle: ''
  };
  showNoResults = false;
  searchResults = [];
  @ViewChild('reviewTitleRef') reviewTitleRef: ElementRef;

  constructor(private _router: Router, private service: ReviewService, private dev: DevService, private layout: LayoutService) {
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.service.getReviewSummary(true).subscribe(summary => {
      this.summary = summary;
      this.loading = false;
    });
  }

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    if (this.searchOpen) {
      setTimeout(() => { this.reviewTitleRef.nativeElement.focus(); });
    }
  }
  search() {
    this.showNoResults = false;
    this.searchResults = this.summary.deadlineGroupings.reduce((acc, item) => {

      acc = acc.concat(item.items.filter(r => r.title.toLowerCase().indexOf(this.searchCriteria.reviewTitle.toLowerCase()) === 0));

      return acc;
    }, []);
    if (this.searchResults.length === 0) {
      this.showNoResults = true;
    }
  }

  clearSearch() {
    this.searchCriteria.reviewTitle = '';
    this.searchResults = [];
    setTimeout(() => { this.reviewTitleRef.nativeElement.focus(); });
  }

  resetReviewStage(id) {
    this.dev.resetReview(id).subscribe(() => {
      this.load();
    });
  }

  open(grouping: ReviewDeadlineGrouping, count) {

    const stage = count ? count.key : 'Total';
    this._router.navigate(['review/items', grouping.deadline, stage]);
  }


}
