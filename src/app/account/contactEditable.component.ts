import { Component, Input, OnInit, ViewChildren } from '@angular/core';
import { Contact } from './model/Contact';
import { AccountService } from './service/account.service';
import { AuthService } from '../core/service/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirmDialog.component';
import { ValidationError } from '../core/model/ValidationError';
@Component({
  selector: 'app-contact-editable',
  moduleId: module.id,
  templateUrl: './contactEditable.component.html'
})
export class ContactEditableComponent implements OnInit {
  @Input() contact: Contact;
  @Input() creating = false;
  editing = false;
  saving = false;


  editableContact: Contact;
  validationErrors: Array<ValidationError> = [];
  emailErrors: Array<string> = [];
  constructor(private service: AccountService, private auth: AuthService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.editableContact = Object.assign({}, this.contact);
  }


  save() {
    this.saving = true;
    this.validationErrors = [];
    this.emailErrors = [];

    this.service.saveContact(this.editableContact)
    .subscribe(result => {
      if (this.contact.email !== this.editableContact.email) {
        this.service.requestEmailUpdate(this.editableContact.email).subscribe(emailResult => {
          this.editableContact.awaitingEmailConfirmation = true;
          this.editableContact.email = this.contact.email;
          this.editing = false;
          this.saving = false;
          this.contact = Object.assign({}, this.editableContact);
          this.auth.updateCachedContact(this.contact);
        }, error => {
          this.saving = false;
          const emailErrors = error.validationErrors.filter(e => e.property === 'Email' );
          if (emailErrors.length) {
            this.emailErrors = emailErrors[0].errors;
          }
        });
      } else {
        this.editing = false;
        this.saving = false;
        this.contact = Object.assign({}, this.editableContact);
        this.auth.updateCachedContact(this.contact);
      }
    },
    error => {
      this.saving = false;
      if (error.validationErrors) {
        this.validationErrors = error.validationErrors;
      }
    });
  }

  onEdit() {
    this.editing = true;
  }


  cancel() {
    this.editing = false;
    this.editableContact = Object.assign({}, this.contact);
  }
}
