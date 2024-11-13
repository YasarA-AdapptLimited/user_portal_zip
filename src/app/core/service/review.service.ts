import { Injectable } from '@angular/core';
import { Review } from '../../review/model/Review';
import { ReviewSummaryItem } from '../../review/model/ReviewSummaryItem';
import { ReviewSummary } from '../../review/model/ReviewSummary';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { Feedback } from '../../review/model/Feedback';
import { PerformanceIndicator } from '../../review/model/PerformanceIndicator';
import { Message } from '../../review/model/Message';
import { CustomErrorHandler } from './CustomErrorHandler';
import { of as observableOf, from as observableFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ReviewStage } from '../../review/model/ReviewStage';
import { ReviewDeadlineGrouping } from '../../review/model/ReviewDeadlineGrouping';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';
declare function require(moduleName: string): any;
const mockReviews = {
  '89395f41-97be-4e2c-915d-18249b05f5cf': require(`./mock/reviews/89395f41-97be-4e2c-915d-18249b05f5cf.mock.json`),
  'b65a21bb-2ccc-4849-99cf-5da5e0a031fd': require(`./mock/reviews/b65a21bb-2ccc-4849-99cf-5da5e0a031fd.mock.json`),
  'cda4c885-699e-464d-99c1-11c6639631b7': require(`./mock/reviews/cda4c885-699e-464d-99c1-11c6639631b7.mock.json`)
  , 'b65a21bb-2ccc-4849-99cf-5da5e0a031fc': require(`./mock/reviews/b65a21bb-2ccc-4849-99cf-5da5e0a031fc.mock.json`),
  'b65a21bb-2ccc-4849-99cf-5da5e0a031fe': require(`./mock/reviews/b65a21bb-2ccc-4849-99cf-5da5e0a031fe.mock.json`)
};

const mockReviewSummaries = require('./mock/reviewSummaries.mock.json');

function mapReviewSummary(i): ReviewSummaryItem {
  const item = new ReviewSummaryItem();
  Object.assign(item, i);
  return item;
}
/*
function mapReviewToSummary(review: Review): ReviewSummary {
  const out: ReviewSummary = new ReviewSummary();
  out.cpdSubmissionId = review.cpdReviewId;
  out.id = review.cpdReviewId;
  out.title = review.cpdReviewId;
  out.reviewerConfirmation = review.reviewerConfirmation;
  out.stage = review.stage;
  out.reviewDeadline = '2017-08-01T00:00:00';
  // out.isFeedbackEditable = review.isFeedbackEditable;
  out.isLead = review.isLeadReviewer;
  return out;
}
*/
function mapReview(data): Review {
  return new Review(data);
}



@Injectable()
export class ReviewService extends ServiceBase {

  constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
    super(http, auth, log, errorHandler);
  }

  reviewSummary: ReviewSummary;

  getReviewSummary(bustCache = false): Observable<ReviewSummary> {
    /*  return observableOf(<ReviewSummary[]>mockReviewSummaries.data.reviewSummaries.map(mapReviewSummary));*/

    if (bustCache) {
      this.reviewSummary = undefined;
    }

    const stages = Object.keys(ReviewStage).map(key => ReviewStage[key]).filter(item => !isNaN(item) && item < 5 && item > 0);

    if (this.reviewSummary) {
      return observableOf(this.reviewSummary);
    }

    return super.get('v1.0/reviewer/reviewsummaries')
      .pipe(map(data => <ReviewSummaryItem[]>data.reviewSummaries.map(mapReviewSummary)))
      .pipe(map(items => {

        const deadlineGroupings: Array<ReviewDeadlineGrouping> = items.reduce((acc, item) => {
          const existingGrouping = acc.find(g => g.deadline === item.reviewDeadline);
          if (existingGrouping) {
            existingGrouping.items.push(item);
          } else {
            const newGrouping = { deadline: item.reviewDeadline, counts: [], items: [item] };
            acc.push(newGrouping);
          }
          return acc;
        }, []);

        deadlineGroupings.forEach(g => {
          g.counts.push({ key: 'Total', count: g.items.length, items: g.items });
          stages.forEach(stage => {
            const stageItems = g.items.filter(item => item.stage === stage);
            g.counts.push({ key: ReviewStage[stage], count: stageItems.length, items: stageItems });
          });
          const qaItems = g.items.filter(item => item.stage > 4);
          g.counts.push({ key: 'QualityAssurance', count: qaItems.length, items: qaItems });
          if (qaItems.length === g.items.length) {
            g.completed = true;
          }
        });

        deadlineGroupings.sort((a, b) => {
          if (a.completed && !b.completed) {
            return 1;
          }
          if (new Date(a.deadline) > new Date(b.deadline)) { return 1; }
          return -1;
        });

        this.reviewSummary = {
          headers: ['Total', ...stages.map(stage => ReviewStage[stage]), 'QualityAssurance'],
          deadlineGroupings
        };
        return this.reviewSummary;

      }));
  }

  load(id): Observable<Review> {
    //  const data = mockReviews[id].data;
    //  return observableOf(<Review>mapReview(data));

    return super.get(`v1.0/reviewer/reviews/${id}`)
      .pipe(map(data => <Review>mapReview(data)));
  }

  save(item): Observable<boolean> {
    return observableOf(false);
  }


  saveAnnotation(reviewId, entryId, annotation) {
    return super.post(`v1.0/reviewer/annotations`, {
      reviewId,
      revalidationEntryId: entryId,
      annotation
    }).pipe(tap(() => {   this.reviewSummary = undefined; }));
    // bust cache

  }
  submitDiscussion(reviewId) {
    return super.post(`v1.0/reviewer/discussioncompleted`, { reviewId, completed: true });
  }

  setInitialAssessment(reviewId, reviewerAssessment: PerformanceIndicator) {
    return super.post(`v1.0/reviewer/assessments`, { reviewId, reviewerAssessment });
  }

  sendDiscussionMessage(reviewId, text) {
    return super.post(`v1.0/reviewer/messages`, { reviewId, text });
  }

  getDiscussionMessages(reviewId): Observable<Message[]> {
    return super.get(`v1.0/reviewer/messages?reviewId=${reviewId}`);
  }

  saveFeedback(reviewId, feedback: Feedback) {
    return super.post(`v1.0/reviewer/feedbacks`, { reviewId, feedback, submit: false });
  }

  submitFeedback(reviewId, feedback: Feedback) {
    return super.post(`v1.0/reviewer/feedbacks`, { reviewId, feedback, submit: true });
  }

  submitFeedbackApproval(reviewId, approve, reviewFeedbackId, reason?) {
    return super.post(`v1.0/reviewer/feedbacks/approval`, { reviewId, approve, reviewFeedbackId, reason });
  }




}
