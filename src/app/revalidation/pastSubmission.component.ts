import { Component, OnInit } from '@angular/core';
import { RevalidationService } from '../core/service/revalidation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Revalidation } from '../shared/model/revalidation/Revalidation';
import { revalidationItemTypes } from '../shared/model/revalidation/revalidationItemTypes';
import { DatePipe } from '@angular/common';
import { LayoutService } from '../core/service/layout.service';

@Component({
  selector: 'app-past-submission',
  moduleId: module.id,
  templateUrl: './pastSubmission.component.html',
  styleUrls: ['./pastSubmission.scss']
})
export class PastSubmissionComponent implements OnInit {

  revalidationItemTypes = revalidationItemTypes;
  loading = false;
  pastSubmissions: Array<Revalidation>;
  id: string;
  revalidation: Revalidation;
  selectedIndex = 0;
  title;

  constructor(private service: RevalidationService, private route: ActivatedRoute,
    private router: Router, private datePipe: DatePipe, private layout: LayoutService) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.layout.setFullscreen(true);
    this.loading = true;
    // todo: cache past submissions
    this.service.getPastSubmissions().subscribe(submissions => {
      this.revalidation = submissions.filter(s => s.id === this.id)[0];
      this.title = 'Submission for renewal date ' +
      this.datePipe.transform(this.revalidation.expectations.submissionDeadline, 'dd/MM/yyyy');
      this.loading = false;
    });
  }

  exit() {
    this.router.navigate(['/revalidation']);
  }
}
