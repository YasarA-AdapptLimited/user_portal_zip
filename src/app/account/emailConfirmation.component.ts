import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from './service/account.service';
import { AuthService } from '../core/service/auth.service';
import { LayoutService } from '../core/service/layout.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirmDialog.component';


@Component({
  moduleId: module.id,
  templateUrl: './emailConfirmation.component.html',
  styleUrls: ['./emailConfirmation.scss']
})
export class EmailConfirmationComponent implements OnInit  {

  loading = false;
  token: string;
  success: boolean;
  error: string;
  email: string;

  constructor(public auth: AuthService, private layout: LayoutService,
    private route: ActivatedRoute, private dialog: MatDialog, private router: Router) {
    this.token = this.route.snapshot.queryParams['token'];
  }

  ngOnInit() {
    this.layout.setAccountMode(true);
    this.loading = true;
    this.auth.confirmEmail(this.token).subscribe((result) => {
      this.loading = false;
      this.success = true;
      this.logout(result.updatedEmail);
    }, error => {
      this.loading = false;
      this.success = false;
      this.error = error && error.message ? error.message : 'Unknown error';
    });
  }

  logout(newEmailAddress) {

    let dialogRef;
    const isLoggedIn = this.auth.user && this.auth.userId;
    if (isLoggedIn) {
      if (this.auth.user) {
        this.auth.user.contact.email = newEmailAddress;
        this.auth.updateCachedContact(this.auth.user.contact);
      }
      dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          allowCancel: false,
          confirmText: 'Sign out',
          title: `Email address updated`,
          message: `<p>You have successfully updated your email address. Since your email
          address is also your account login, you will now be signed out of myGPhC. </p>
          <p>Remember to sign back in with your new email address: ${newEmailAddress}</p>`
        }
      });
    } else {
      dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          allowCancel: false,
          confirmText: 'OK',
          title: `Email address updated`,
          message: `<p>You have successfully updated your email address.</p><p>Remember to sign in
          with your new email address: ${newEmailAddress}</p>`
        }
      });
    }

    dialogRef.afterClosed().subscribe(() => {
      if (isLoggedIn) {
        this.auth.logout();
      } else {
        this.router.navigate(['/signin']);
      }
    });
  }
}
