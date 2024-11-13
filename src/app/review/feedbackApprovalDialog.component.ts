import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-feedback-approval-dialog',
  templateUrl: './feedbackApprovalDialog.html',
  styleUrls: ['./feedbackApprovalDialog.scss']
})
export class FeedbackApprovalDialogComponent {

  approval = {
    approved: undefined,
    reason: ''
  };

  constructor(public dialogRef: MatDialogRef<FeedbackApprovalDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  invalid() {
    return this.approval.approved === undefined ||
      this.approval.approved === false && !this.approval.reason.trim();
  }

}
