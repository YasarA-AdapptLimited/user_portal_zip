import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Review } from './model/Review';
import { CpdEntry } from '../shared/model/review/CpdEntry';
import { RevalidationItemType } from '../shared/model/revalidation/RevalidationItemType';
import { revalidationItemTypes } from '../shared/model/revalidation/revalidationItemTypes';
import { RevalidationItemTypeConfig } from '../shared/model/revalidation/RevalidationItemTypeConfig';
import { ReviewStage } from './model/ReviewStage';
import { Feedback } from './model/Feedback';

@Component({
  selector: 'app-feedback-sections-readonly',
  moduleId: module.id,
  templateUrl: './feedbackSectionsReadonly.component.html',
  styleUrls: ['./feedbackSections.scss']
})
export class FeedbackSectionsReadonlyComponent implements OnInit {

  @Input() review: Review;
  @Input() feedback: Feedback;
  @Output() onSelected = new EventEmitter<RevalidationItemTypeConfig>();

  sections: any[];
  selected: RevalidationItemTypeConfig;
  editing = false;

  ngOnInit() {

    const types = this.review.entries.reduce(
      (acc: Array<RevalidationItemType>, item: CpdEntry) => {
        if (acc.indexOf(item.type) === -1) {
          acc.push(item.type);
        }
        return acc;
      }, []);
    const sections = types.map(t => {
      const section: any = revalidationItemTypes.filter(r => r.type === t)[0];
      section.isFeedback = true;
      section.editing = false;
      return section;
    });

    this.sections = sections;
    this.select(this.sections[0]);
  }



  helpClick($event, section) {
    section.helpVisible = !section.helpVisible;
    $event.stopPropagation();

  }


  select(item: RevalidationItemTypeConfig) {
    if (this.selected === item) {
      this.selected = undefined;
    } else {
      this.selected = item;
    }

    setTimeout(() => {
      this.onSelected.emit(this.selected);
    });
  }




}
