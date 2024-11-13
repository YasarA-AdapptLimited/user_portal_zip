import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: 'confirmDialog.html',
  styles: [`mat-dialog-actions {
    button:focus { box-shadow: 0 0 0 2px #fcc340 !important; }
  }`]
})
export class ConfirmDialogComponent {

  defaultMessage = 'The action is irreversible - are you sure?';
  defaultTitle = 'Delete item';
  allowCancel = true;
  allowNext = true;
  confirmProgressReport = false;
  confirmFinalDeclaration = false;

  get message(): string {
    if (this.data && this.data.message) {
      return this.data.message;
    }
    return this.defaultMessage;
  }

  get title(): string {
    if (this.data && this.data.title) {
      return this.data.title;
    }
    return this.defaultTitle;
  }

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

    if (data.allowCancel === false) {
      this.allowCancel = false;
    }

    this.confirmProgressReport = data.confirmProgressReport;
    this.confirmFinalDeclaration = data.confirmFinalDeclaration;

    if (data.allowNext === false) {
      this.allowNext = false;
    }

  }

}
