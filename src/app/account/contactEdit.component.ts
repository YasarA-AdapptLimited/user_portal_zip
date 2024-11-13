import { Component, Input, OnInit, ViewChildren, ViewChild, forwardRef } from '@angular/core';
import { Contact } from './model/Contact';
import { AccountService } from './service/account.service';
import { AuthService } from '../core/service/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirmDialog.component';
import { NgForm, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Tooltip } from '../core/tooltip/Tooltip';

@Component({
  selector: 'app-contact-edit',
  moduleId: module.id,
  templateUrl: './contactEdit.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContactEditComponent),
      multi: true
    }
  ]
})
export class ContactEditComponent implements ControlValueAccessor {
  @Input() contact: Contact = new Contact({});
  @Input() serverEmailErrors;
  @Input() emailReadonly = false;
  @Input() phoneNumberReadonly = false;
  @Input() emailNotRequire = false;
  touched = false;
  @ViewChildren('focus') vc;

  @ViewChild('form') form: NgForm;
  @Input() set editing(editing) {
    if (editing) {
      this.setFocus();
    }
  }
  ukMobTooltip: Tooltip = {
    id: 'help',
    content: `Enter a UK mobile number 8-11 numbers long, which begins with 07. We may use this number
    to contact you by SMS in future. If you agree to this in your communication preferences.
    You can manage these in the 'account' tab.
    `,
    width: 250,
    placement: 'left',
    order: -1
  };



  constructor(private service: AccountService, private auth: AuthService, private dialog: MatDialog) {
  }
  setFocus() {
    setTimeout(function () {
      if (this.vc.first) {
        this.vc.first.nativeElement.focus();
      }
    }.bind(this), 100);
  }

  propagate() {
    if (this.contact.mobilePhone !== null && this.contact.mobilePhone !== undefined
      && this.contact.mobilePhone.trim() === '') {
      this.contact.mobilePhone = null;
    }
    if (this.form.valid) {
      this.propagateChange(this.contact);
    }
  }

  get valid() {
    return this.form && this.form.valid;
  }


  writeValue(value: any) {
    if (value) {
      this.contact = value;
    }
  }
  propagateChange = (model: any) => { };
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() { }


}
