import { Component, Input, OnInit, ElementRef, HostListener, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Review } from './model/Review';
import { ReviewStage } from './model/ReviewStage';
import { ReviewService } from '../core/service/review.service';
import { LayoutService } from '../core/service/layout.service';
import { ReviewManagerService } from './reviewManager.service';

@Component({
  selector: 'app-review',
  moduleId: module.id,
  templateUrl: './review.component.html',
  styleUrls: ['./review.scss'],
  providers: [ ReviewManagerService ]
})
export class ReviewComponent implements OnInit {

  reviewId: string;
  review: Review;
  loading: boolean;

  ReviewStage = ReviewStage;

  constructor(private route: ActivatedRoute,
    private router: Router, private service: ReviewService, public manager: ReviewManagerService) {
    this.reviewId = this.route.snapshot.params['reviewId'];
  }

  @HostBinding('class.help-visible') get helpVisible() {
    return this.manager.helpVisible$.value;
  }


  ngOnInit() {
    this.loading = true;
    this.service
      .load(this.reviewId)
      .subscribe(review => {
        this.manager.setReview(review);
        this.loading = false;
      });
  }

}
