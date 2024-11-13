import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackComponent } from './feedback.component';
import { AnnotateComponent } from './annotate.component';
import { DiscussComponent } from './discuss.component';
import { ReviewSummaryComponent } from './reviewSummary.component';
import { ReviewComponent } from './review.component';
import { ReviewSummaryListComponent } from './reviewSummaryList.component';


const routes: Routes = [
  { path: '', component: ReviewSummaryComponent, data: { title: 'Review summary' } },
  { path: 'items/:deadline/:stage', component: ReviewSummaryListComponent,
  data: { title: 'Reviews', fullscreen: true, classname : 'application' } },
  { path: ':reviewId', component: ReviewComponent, data: { title: 'Review', fullscreen: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewRoutingModule { }
