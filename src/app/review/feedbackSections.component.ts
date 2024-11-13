import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Review } from './model/Review';
import { CpdEntry } from '../shared/model/review/CpdEntry';
import { RevalidationItemType } from '../shared/model/revalidation/RevalidationItemType';
import { revalidationItemTypes } from '../shared/model/revalidation/revalidationItemTypes';
import { RevalidationItemTypeConfig } from '../shared/model/revalidation/RevalidationItemTypeConfig';
import { AssessmentComponent } from './assessment.component';

@Component({
  selector: 'app-feedback-sections',
  moduleId: module.id,
  templateUrl: './feedbackSections.component.html',
  styleUrls: ['./feedbackSections.scss']
})
export class FeedbackSectionsComponent implements OnInit {

  @Input() review: Review;
  @Output() onSelected = new EventEmitter<RevalidationItemTypeConfig>();

  sections: any[];
  selected: RevalidationItemTypeConfig;
  @ViewChild(AssessmentComponent) assessment: AssessmentComponent;

  ngOnInit() {
    const types = this.review.entries.reduce(
      (acc: Array<RevalidationItemType>, item: CpdEntry) => {
        if (acc.indexOf(item.type) === -1) {
          acc.push(item.type);
        }
        return acc;
      }, []);
    const sections = types.map(t => {
        const feedbackSection: any = revalidationItemTypes.filter(r => r.type === t)[0];
        feedbackSection.isFeedback = true;
        return feedbackSection;
    });

    sections.push({ isAssessment: true, title: 'Final assessment' });
    this.sections = sections;
    this.select(this.sections[0]);
  }

  helpClick($event, section) {
    section.helpVisible = !section.helpVisible;
    $event.stopPropagation();

  }

  selectAssessment() {
    const item = this.sections.find(section => section.isAssessment);
    if (this.selected === item) {
      return;
    } else {
      this.selected = item;
    }
    this.assessment.showNoAssessmentMessage = true;
    setTimeout(() => {
      this.onSelected.emit(this.selected);
    });
  }

  select(item: RevalidationItemTypeConfig) {
    if (this.selected === item) {
      return;
    } else {
      this.selected = item;
    }

    setTimeout(() => {
      this.onSelected.emit(this.selected);
    });
  }

  update(content) {
    this.review.feedback[this.selected.feedbackType] = content;
  }


}
