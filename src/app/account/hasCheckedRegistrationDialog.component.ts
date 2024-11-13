import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../core/service/auth.service';
import { User } from './model/User';
import { Router } from '@angular/router';
import { AccountService } from './service/account.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    moduleId: module.id,
    templateUrl: './hasCheckedRegistrationDialog.component.html',
    styleUrls: ['./dialog.scss']
})
export class HasCheckedRegistrationDialogComponent implements OnInit {

    user: User;
    hasViewedPage = false;

    constructor(private dialogRef: MatDialogRef<HasCheckedRegistrationDialogComponent>,
      private router: Router, public auth: AuthService, private accountService: AccountService) {
    }

    ngOnInit() {
        this.user = this.auth.user;
    }

    checkDetails() {
      this.router.navigate(['/registration']).then(() => {
        this.accountService.hasCheckedRegistrationDetails().subscribe(() => {
          this.dialogRef.close();
          this.auth.updateCachedHasCheckedRegistrationDetails();
        }, error => {
          // do something ?
          this.dialogRef.close();
        });
      });
    }

}
