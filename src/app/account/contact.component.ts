import { Component, Input, OnInit, ViewChildren } from '@angular/core';
import { Contact } from './model/Contact';
import { AccountService } from './service/account.service';
import { AuthService } from '../core/service/auth.service';
import { ConfirmDialogComponent } from '../shared/confirmDialog.component';


@Component({
  selector: 'app-contact',
  moduleId: module.id,
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  @Input() contact: Contact;

  getEmailValue() {
    if (this.contact.awaitingEmailConfirmation) {
      return this.contact.email + ' (change pending)';
    } else {
      return this.contact.email;
    }
  }

}
