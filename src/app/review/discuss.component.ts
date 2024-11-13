import {
  Component,
  Input, OnInit,
  AfterViewInit, ViewChild, ElementRef,
  HostListener, Inject, OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Review } from './model/Review';
import { revalidationItemTypes } from '../shared/model/revalidation/revalidationItemTypes';
import { ReviewService } from '../core/service/review.service';
import { DOCUMENT } from '@angular/common';
import { LayoutService } from '../core/service/layout.service';
import { DiscussionStatus } from './model/DiscussionStatus';
import { ReviewManagerService } from './reviewManager.service';
import { trigger, transition, animate, style, state } from '@angular/animations';
@Component({
  selector: 'app-discuss',
  moduleId: module.id,
  templateUrl: './discuss.component.html',
  styleUrls: ['./discuss.scss'],
  animations: [
    trigger('slideInOut', [
      state('open', style({
        transform: 'translateX(0)'
        //  opacity: '1',
        //  display: 'block'
      })),
      state('closed', style({
        transform: 'translateX(360px)'
        //    opacity: '0',
        //    display: 'none'
      })),
      transition('open => closed', [
        animate('250ms cubic-bezier(0, 0, 0.2, 1)')
      ]),
      transition('closed => open', [
        animate('250ms cubic-bezier(0, 0, 0.2, 1)')
      ]),
    ])]
})
export class DiscussComponent implements OnInit, OnDestroy {

  revalidationItemTypes = revalidationItemTypes;
  helpVisible = true;
  reviewId: string;
  @ViewChild('cpd') cpd: ElementRef;
  @ViewChild('container') container: ElementRef;


  cpdOffset = undefined;
  loading = false;
  containerTop;
  subscriptions = [];

  constructor(@Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private router: Router,
    private service: ReviewService,
    public manager: ReviewManagerService,
    private elementRef: ElementRef,
    private layout: LayoutService) {
    this.reviewId = this.route.snapshot.params['reviewId'];
  }


  get review() {
    return this.manager.review;
  }

  ngOnInit() {



  }


  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  submit() {
    this.loading = true;
    this.service.submitDiscussion(this.review.id).subscribe(() => {
      this.exit();
    });
  }

  setCpdOffset() {
    if (this.container && this.cpd) {
      const containerWidth = this.container.nativeElement.getBoundingClientRect().width;
      const cpdWidth = this.cpd.nativeElement.getBoundingClientRect().width;
      this.cpdOffset = -((containerWidth - cpdWidth) / 2);
    }
  }


  exit() {
    history.back();
    // this.router.navigate(['/review']);
  }
}
