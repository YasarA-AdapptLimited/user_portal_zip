import { Component, Input, OnInit } from '@angular/core';
import { Contact } from './model/Contact';
import { AccountService } from './service/account.service';
import { AuthService } from '../core/service/auth.service';
import { UserPreference } from './model/UserPreference';
import { SaveState } from './model/SaveState';

@Component({
  selector: 'app-preference-editable',
  moduleId: module.id,
  templateUrl: './preferenceEditable.component.html'
})
export class PreferenceEditableComponent implements OnInit {

  editing = false;
  saving = false;

  SaveState = SaveState;
  saveState: SaveState = SaveState.untouched;

  editablePreference: UserPreference;
  preference: UserPreference;

  constructor(private service: AccountService, public auth: AuthService) {

  }

  ngOnInit() {
    if (!this.auth.user.preference) {
      this.auth.user.preference = {
        comms: {
          essentialEmails: false,
          essentialTexts: false,
          importantEmails: false,
          importantTexts: false
        },
        ui: {
          showTooltips: true
        }
      };
    }
    if (!this.auth.user.preference.ui) {
      this.auth.user.preference.ui =  {
        showTooltips: true
      };
    }

    this.preference = this.auth.user.preference;
    this.editablePreference = Object.assign({}, this.auth.user.preference);
  }

  save() {
    this.saving = true;
    this.service.savePreference(this.editablePreference)
    .subscribe(result => {
      this.auth.user.preference = Object.assign({}, this.editablePreference);
      this.preference = this.auth.user.preference;
      this.auth.updateCachedPreference(this.auth.user.preference);
      this.editing = false;
      this.saving = false;
      this.saveState = SaveState.saved;
    },
    error => {
      this.saving = false;
    });
  }

  onEdit() {
    this.editing = true;
    this.saveState = SaveState.untouched;
  }


  cancel() {
    if (this.saveState === SaveState.confirmationRequired) {
      this.saveState = SaveState.untouched;
    } else {
      this.editing = false;
      this.editablePreference = Object.assign({}, this.auth.user.preference);
    }
  }

  onSaveStateChange(state: SaveState) {
   // this.saveState = state;
   // if (state === SaveState.confirmed) {
      this.confirm();
   // }
  }

  trySave() {
    if (this.saveState === SaveState.untouched) {
      this.saveState = SaveState.touched;
    } else {
      this.confirm();
    }
  }

  change() {
    this.saveState = SaveState.untouched;
  }

  confirm() {
    this.save();
  }
}
