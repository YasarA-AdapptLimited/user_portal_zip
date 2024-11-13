import { Injectable, Inject } from '@angular/core';
import { RevalidationSubmission } from '../../model/revalidation/RevalidationSubmission';
import { RevalidationItemType } from '../../model/revalidation/RevalidationItemType';
import { RevalidationItem } from '../../model/revalidation/RevalidationItem';
import { SubmissionInfo } from '../../model/revalidation/SubmissionInfo';
import { SubmissionExpectations } from '../../model/revalidation/SubmissionExpectations';
import { FormTemplate } from '../../../dynamic/model/FormTemplate';
import { RevalidationService } from '../../../core/service/revalidation.service';

@Injectable()
export class RevalidationLogic {

  submission: RevalidationSubmission;
  expectations: SubmissionExpectations;
  items: RevalidationItem[];
  requiredCount = {};
  overMaxWarning = {};
  countInfo = {};
  loaded = false;
  constructor(@Inject(RevalidationService) private service: RevalidationService) {
  }

  countQuestions(template: FormTemplate) {
    return template.questionGroups
      .reduce((acc, questionGroup) => {
        acc += questionGroup.questions ? questionGroup.questions.length : 0;
        return acc;
      }, 0);
  }

  setItemProgress(item: RevalidationItem) {
    item.completed = item.isCompleted;
    item.progress = item.answers.length;
    this.service.getFormTemplateById(item.dynamicFormId).subscribe(template => {
      item.total = this.countQuestions(template);
    });
  }

  load(items: RevalidationItem[], expectations: SubmissionExpectations) {
    this.items = items || [];
    this.submission = new RevalidationSubmission();
    this.expectations = expectations;
    this.submission.total = expectations.expectedTotalCount;
    // this.submission.submitted = info.submitted;
    // this.submission.submissionDate = info.submissionDate;
    this.items.forEach(item => this.setItemProgress(item));

    this.setProgress();
    this.loaded = true;
  }

  setProgress() {
    for (const key in RevalidationItemType) {
      if (+key > 0 && RevalidationItemType.hasOwnProperty(key) && !isNaN(Number(key))) {
        this.requiredCount[key] = this.getRequiredCount(<RevalidationItemType>Number(key));
        this.overMaxWarning[key] = this.getOverMaxWarning(<RevalidationItemType>Number(key));
        this.countInfo[key] = this.getCountInfo(<RevalidationItemType>Number(key));
      }
    }
    const submission = Object.assign({}, this.submission);
    submission.progress = this.getProgress();
    submission.completed = this.getIsCompleted();
    submission.error = submission.invalid = this.hasOverMax();
    this.submission = submission;
    return submission;
  }

  getRequiredCount(type: RevalidationItemType) {
    switch (type) {
      case RevalidationItemType.PeerDiscussion:
        return +this.expectations.expectedPeerDiscussions;
      case RevalidationItemType.ReflectiveAccount:
        return +this.expectations.expectedReflectiveAccounts;
      case RevalidationItemType.Unplanned:
        return +this.expectations.maxUnplanned;
      case RevalidationItemType.Planned:
        let unplannedCpdCount = this.getUnplannedCpdCount();
        unplannedCpdCount = unplannedCpdCount > this.expectations.maxUnplanned ? 2 : unplannedCpdCount;
        return +this.expectations.expectedCpds - unplannedCpdCount;
    }
  }

  getCountInfo(type: RevalidationItemType): string {
    switch (type) {
      case RevalidationItemType.Planned:
      case RevalidationItemType.Unplanned:
        return `You must submit a total of ${this.expectations.expectedCpds} CPDs,
        of which up to ${this.expectations.maxUnplanned} may be unplanned`;
      case RevalidationItemType.PeerDiscussion:
        if (this.expectations.expectedPeerDiscussions > 1) {
          return `You must submit ${this.expectations.expectedPeerDiscussions} peer discussions`;
        } else {
          return `You must submit ${this.expectations.expectedPeerDiscussions} peer discussion.`;
        }
      case RevalidationItemType.ReflectiveAccount:
        if (this.expectations.expectedReflectiveAccounts > 1) {
          return `You must submit ${this.expectations.expectedReflectiveAccounts} reflective accounts`;
        } else {
          return `You must submit ${this.expectations.expectedReflectiveAccounts} reflective account`;
        }
    }
  }

  getOverMaxWarning(type: RevalidationItemType): string {
    switch (type) {
      case RevalidationItemType.PeerDiscussion:
        if (this.expectations.expectedPeerDiscussions > 1) {
          return `You may only submit <span class="revals-err">${this.expectations.expectedPeerDiscussions}</span> peer discussions`;
        } else {
          return `You may submit only <span class="revals-err">${this.expectations.expectedPeerDiscussions}</span> peer discussion`;
        }

      case RevalidationItemType.ReflectiveAccount:

        if (this.expectations.expectedReflectiveAccounts > 1) {
          return `You may only submit <span class="revals-err">${this.expectations.expectedReflectiveAccounts}</span> reflective accounts`;
        } else {
          return `You may submit only <span class="revals-err">${this.expectations.expectedReflectiveAccounts}</span> reflective account`;
        }
      case RevalidationItemType.Unplanned:
        if (this.expectations.maxUnplanned > 1) {
          return `You may only submit a maximum of <span class="revals-err">${this.expectations.maxUnplanned}</span> unplanned CPDs`;
        } else {
          return `You may submit only <span class="revals-err">${this.expectations.maxUnplanned}</span> unplanned CPD`;
        }
      case RevalidationItemType.Planned:
        let unplannedCpdCount = this.getUnplannedCpdCount();
        const plannedCpdCount = this.getPlannedCpdCount();
        unplannedCpdCount = unplannedCpdCount > this.expectations.maxUnplanned ? 2 : unplannedCpdCount;
        if (!unplannedCpdCount) { return `You may only submit <span class="revals-err">${this.expectations.expectedCpds}</span> CPDs in total.` };
        let message = `You must submit a maximum of <span class="revals-err">${this.expectations.expectedCpds}</span> CPDs. `;
        if (unplannedCpdCount === 1) {
          message += `As you have created an unplanned CPD, `;
        }
        if (unplannedCpdCount > 1) {
          message += `As you already have <span class="revals-err">${unplannedCpdCount}</span> unplanned CPDs, `;
        }
        message += `you only need to submit
           <span class="revals-err">${this.expectations.expectedCpds - unplannedCpdCount}</span>
           planned. `;

        const plannedCpdCountToSubmit = plannedCpdCount <= this.expectations.maxUnplanned ? plannedCpdCount :
          this.expectations.expectedCpds;

        if (plannedCpdCountToSubmit === this.expectations.expectedCpds) {
          message += `(If you want to submit <span class="revals-err">${plannedCpdCountToSubmit}</span> planned CPDs,
              you must exclude your unplanned ones.)`;

        } else {
          message += `(If you want to submit <span class="revals-err">${plannedCpdCountToSubmit}</span> planned,
              you must exclude <span class="revals-err">${this.getUnplannedCpdCount() -
            (this.expectations.expectedCpds - plannedCpdCount)}</span> unplanned.)`;
        }

        return message;
    }
  }

  hasOverMax() {
    return this.getUnplannedCpdCount() > this.expectations.maxUnplanned ||
      this.getPlannedCpdCount() > (this.expectations.expectedCpds - this.getUnplannedCpdCount()) ||
      this.getReflectiveAccountCount() > this.expectations.expectedReflectiveAccounts ||
      this.getPeerDiscussionCount() > this.expectations.expectedPeerDiscussions;
  }

  getUnplannedCpdCount(): number {
    return this.items
      .filter(item =>
        item.included &&
        item.type === RevalidationItemType.Unplanned).length;
  }

  getPlannedCpdCount(): number {
    return this.items
      .filter(item =>
        item.included &&
        item.type === RevalidationItemType.Planned).length;
  }

  getReflectiveAccountCount(): number {
    return this.items
      .filter(item =>
        item.included &&
        item.type === RevalidationItemType.ReflectiveAccount).length;
  }

  getPeerDiscussionCount(): number {
    return this.items
      .filter(item => item.included &&
        item.type === RevalidationItemType.PeerDiscussion).length;
  }

  getCompletedCpdCount(): number {
    const unplannedCpdCount = this.items
      .filter(item =>
        item.included &&
        item.type === RevalidationItemType.Unplanned &&
        item.completed).length;
    const plannedCount = this.items
      .filter(item =>
        item.included &&
        item.type === RevalidationItemType.Planned &&
        item.completed).length;
    return unplannedCpdCount + plannedCount;
  }

  getNotCompleted(): Array<RevalidationItem> {
    return this.items
      .filter(item =>
        item.included &&
        !item.completed);
  }

  markAllIncludedItemsAsCompleted() {
    const notCompleted = this.getNotCompleted();
    notCompleted.forEach(item => {
      item.completed = true;
    });
    this.setProgress();
  }

  getProgress() {
    const reflectiveAccountCount = this.items
      .filter(item =>
        item.included &&
        item.type === RevalidationItemType.ReflectiveAccount &&
        item.completed).length;

    const peerDiscussionCount = this.items
      .filter(item =>
        item.included &&
        item.type === RevalidationItemType.PeerDiscussion &&
        item.completed).length;

    return this.getCompletedCpdCount() + reflectiveAccountCount + peerDiscussionCount;
  }

  getIsCompleted() {
    return this.getProgress() === this.expectations.expectedTotalCount && !this.hasOverMax();
  }

}
