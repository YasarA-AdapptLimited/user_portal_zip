import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class RevalidationSubmission {
    constructor() {}
    private submissionGroup = new BehaviorSubject<any>('No Submission');
    currentSubmission = this.submissionGroup.asObservable();
    changeSubmissionGroup(entry: any) {
            this.submissionGroup.next(entry);
            return true;
    }
}
