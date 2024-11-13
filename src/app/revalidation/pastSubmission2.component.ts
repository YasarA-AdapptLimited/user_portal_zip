import { Component, Input, OnInit, HostListener, ViewChild } from '@angular/core';
import { RevalidationItemType } from '../shared/model/revalidation/RevalidationItemType';
import { RevalidationItemTypeConfig } from '../shared/model/revalidation/RevalidationItemTypeConfig';
import { revalidationItemTypes } from '../shared/model/revalidation/revalidationItemTypes';
import { ReviewService } from '../core/service/review.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from '../core/service/layout.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { RevalidationService } from '../core/service/revalidation.service';
import { DatePipe } from '@angular/common';
import { Revalidation } from '../shared/model/revalidation/Revalidation';
import { BehaviorSubject } from 'rxjs';
import { CpdEntry } from '../shared/model/review/CpdEntry';


@Component({
  selector: 'app-past-submission2',
  moduleId: module.id,
  templateUrl: './pastSubmission2.component.html',
  styleUrls: ['./pastSubmission2.scss'],
  animations: [
    trigger('slideInOut', [
      state('open', style({
        transform: 'translateX(0)'
        //  opacity: '1',
        //  display: 'block'
      })),
      state('closed', style({
        transform: 'translateX(-350px)'
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
export class PastSubmission2Component implements OnInit {

  revalidationItemTypes = revalidationItemTypes;
  loading = false;
  pastSubmissions: Array<Revalidation>;
  id: string;
  revalidation: Revalidation;
  selectedEntryIndex$ = new BehaviorSubject(0);
  title;
  loadingFeedback;
  feedback;
  sections;

  constructor(private service: RevalidationService, private route: ActivatedRoute,
    private router: Router, private datePipe: DatePipe, private layout: LayoutService) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.layout.setFullscreen(true);
    this.loading = true;
    // todo: cache past submissions
    this.service.getPastSubmissions().subscribe(submissions => {
      this.setRevalidation(submissions.find(s => s.id === this.id));
      this.loading = false;
    });

  }

  setRevalidation(revalidation) {
    this.revalidation = revalidation;

    this.title = 'Submission for renewal date ' +
    this.datePipe.transform(revalidation.expectations.submissionDeadline, 'dd/MM/yyyy');
    if (revalidation.hasFeedback) {
      this.loadFeedback();
    }

    const types = revalidation.entries.reduce(
      (acc: Array<RevalidationItemType>, item: CpdEntry) => {
        if (acc.indexOf(item.type) === -1) {
          acc.push(item.type);
        }
        return acc;
      }, []);
    this.sections = types.map(t => {
      const section: any = revalidationItemTypes.filter(r => r.type === t)[0];
      return section;
    });

  }

  loadFeedback() {
    this.loadingFeedback = true;
    this.service.getFeedback(this.revalidation.id).subscribe(feedback => {
      this.feedback = feedback;
      this.loadingFeedback = false;
    }, error => {
      this.loadingFeedback = false;
    });
  }
  exit() {
    this.router.navigate(['/revalidation']);
  }

}
