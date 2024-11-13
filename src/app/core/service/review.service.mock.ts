import { Injectable } from '@angular/core';
import { Review } from '../../review/model/Review';
import { ReviewSummary } from '../../review/model/ReviewSummaryItem';
import { Observable } from 'rxjs/internal/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

function mapReviewSummary(i): ReviewSummary {
  const item = new ReviewSummary();
  Object.assign(item, i);
  return item;
}

function mapReviewToSummary(review: Review): ReviewSummary {
  const out: ReviewSummary = new ReviewSummary();
 // out.cpdSubmissionId = review.cpdReviewId;
  out.id = review.id;
  out.title = review.id;
 // out.reviewerConfirmation = review.reviewerConfirmation;
  out.stage = review.stage;
  out.reviewDeadline = '2017-08-01T00:00:00';
  // out.isFeedbackEditable = review.isFeedbackEditable;
  out.isLead = review.isLeadReviewer;
  return out;
}

function mapReview(i): Review {
  return new Review(i);
}

@Injectable()
export class MockReviewService {

  constructor(private _http: HttpClient) {
  }

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }


  generateMock(): Observable<ReviewSummary[]> {
    localStorage.removeItem('cpdReviews');
    return this.loadFromJsonMock().map(reviewTemplate => {
      const reviewSummaries: ReviewSummary[] = [];
      for (let i = 1; i < 6; i++) {
        const review = mapReview(reviewTemplate);
        review.id = this.guid().split('-')[0];
        review.isLeadReviewer = true;
        review.stage = i;
        review.isFeedbackEditable = i < 4;
        if (i === 1) {
          review.currentReviewerAssessment = 0;
        }
        this.save(review);
        reviewSummaries.push(mapReviewToSummary(review));
      }
      for (let i = 1; i < 6; i++) {
        const review = mapReview(reviewTemplate);
        review.id = this.guid().split('-')[0];
        review.stage = i;
        review.isLeadReviewer = false;
        review.isFeedbackEditable = false;
        if (i === 1) {
          review.currentReviewerAssessment = 0;
        }
        this.save(review);
        reviewSummaries.push(mapReviewToSummary(review));
      }
      return reviewSummaries;

    });
  }
  /*
    getReviewSummaries(): Observable<CpdReviewSummary[]> {
      const items = localStorage.getItem('cpdReviews');
      const url = 'assets/cpd/cpd-reviews.json';
      return this._http.get(url)
        .map(response => {
          return <CpdReviewSummary[]>response.json().reviewSummaries.map(mapCpdReviewSummary);
        })
        .do(data => console.log(data));
    }*/

  getReviewSummaries(): Observable<ReviewSummary[]> {
    const items = localStorage.getItem('cpdReviews');
   // if (!items) {
    //  this.generateCpdReviews(3);
    //  items = localStorage.getItem('cpdReviews');
   // }
    const url = 'assets/cpd/cpd-reviews.json';
    return this._http.get(url)
      .map(response => {
        // if (items) {
          if (!items) { return []; }
          const reviews: Review[] = JSON.parse(items);
          return <ReviewSummary[]>reviews.map(mapReviewToSummary);
       // } else {
       //   return <CpdReviewSummary[]>response.json().reviewSummaries.map/////////(mapCpdReviewSummary);
        // }
      })
      .do(data => console.log(data));
  }

  load(id): Observable<Review> {
    const url = 'assets/cpd/cpd-review.json';
    const items = localStorage.getItem('cpdReviews');
    const itemArray: Review[] = items ? JSON.parse(items) : [];
    return this._http.get(url)
      .map(response => {
        return mapReview(itemArray.filter(i => i.id === id)[0]);

       // return <CpdReview>mapCpdReview(response.json());
      })
      .do(data => console.log(data));
  }

  loadFromJsonMock(): Observable<Review> {
    const url = 'assets/cpd/cpd-review.json';
    return this._http.get(url)
      .map(response => {
        return <Review>mapReview(response);
      });
  }

  save(item) {
    const items = localStorage.getItem('cpdReviews');
    const itemArray = items ? JSON.parse(items) : [];
    if (!item.cpdReviewId) {
      item.cpdReviewId = this.guid();
      itemArray.push(item);
    } else {
      let found = false;
      itemArray.forEach(i => {
        if (item.cpdReviewId === i.cpdReviewId) {
          Object.assign(i, item);
          found = true;
        }
      });
      if (!found) {
        itemArray.push(item);
      }
    }
    localStorage.setItem('cpdReviews', JSON.stringify(itemArray));
    return of('done');
  }
}
