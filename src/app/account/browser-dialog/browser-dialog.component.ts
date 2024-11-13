import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-browser-dialog',
  templateUrl: './browser-dialog.component.html',
  styleUrls: ['./browser-dialog.component.scss']
})
export class BrowserDialogComponent implements OnInit {
  defaultMessage = 'Please change setting to allow third party cookies';
  defaultTitle = 'Your browser has blocked thirdparty cookies';
  defaultAlertTitle ='Important !';
  isNotEdge = false;
  isBlockedByCookies = false;

  get content(): string {
    if (this.data && this.data.content) {
      return this.data.content;
    }
    return this.defaultMessage;
  }

  get title(): string {
    if (this.data && this.data.title) {
      return this.data.title;
    }
    return this.defaultTitle;
  }

  get alertTitle(): string {
    if (this.data && this.data.alertTitle) {
      return this.data.alertTitle;
    }
    return this.defaultAlertTitle;
  }
  constructor(public dialogRef: MatDialogRef<BrowserDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isNotEdge = data.isNotEdge;
    this.isBlockedByCookies = data.isBlockedByCookies;
   }

  ngOnInit() {  
  }


reload(){
  window.location.reload();
}

  close() {
    this.dialogRef.close();
  }
}
