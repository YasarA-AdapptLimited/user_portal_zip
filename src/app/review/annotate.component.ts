import { Component, Input, OnInit, ElementRef, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Review } from './model/Review';
import { revalidationItemTypes } from '../shared/model/revalidation/revalidationItemTypes';
import { ReviewService } from '../core/service/review.service';
import { LayoutService } from '../core/service/layout.service';
import { PerformanceIndicator } from './model/PerformanceIndicator';
import { ReviewHeaderComponent } from './reviewHeader.component';
import { ReviewManagerService } from './reviewManager.service';

@Component({
  selector: 'app-annotate',
  moduleId: module.id,
  templateUrl: './annotate.component.html',
  styleUrls: ['./annotate.scss']
})
export class AnnotateComponent implements OnInit, OnDestroy {


  revalidationItemTypes = revalidationItemTypes;
  selectedIndex = 0;
  items = [];
  loading = false;
  scrolling = false;
  showHelp = true;
  subscriptions = [];
  edit;

  submitted = false;

  constructor(private route: ActivatedRoute,
    private router: Router, private service: ReviewService, public manager: ReviewManagerService,
    private elementRef: ElementRef, private layout: LayoutService) {
  }

  get review() {
    return this.manager.review;
  }

  ngOnInit() {
    this.subscriptions.push(this.manager.exiting$.subscribe(() => {
      this.saveCurrentEdit();
    }));
    this.submitted = !!this.review.currentReviewerAssessment;
  }

  saveCurrentEdit() {
    if (this.edit) {
      this.service.saveAnnotation(this.review.id,
        this.edit.id,
        this.edit.currentReviewerAnnotation).subscribe(() => {
        });
      this.edit = undefined;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  update(item, content) {
    const index = this.manager.selectedEntryIndex$.value;
    this.review.entries[index].currentReviewerAnnotation = content;
    this.edit = this.review.entries[index];
  }

  onScrollStart() {
    this.scrolling = true;
  }

  onScrollEnd() {
    this.scrolling = false;
  }

  saveAssessment() {
    this.service.setInitialAssessment(this.review.id, this.review.currentReviewerAssessment).subscribe(result => {
      this.exit();
    });
  }

  exit() {
    history.back();
  //  this.router.navigate(['/review']);
  }
}
