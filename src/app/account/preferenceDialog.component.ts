import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserPreference } from './model/UserPreference';
import { SaveState } from './model/SaveState';
import { AuthService } from '../core/service/auth.service';
import {AccountService } from './service/account.service';

@Component({
  selector: 'app-preference-dialog',
  templateUrl: './preferenceDialog.component.html',
  styleUrls: ['./preferenceDialog.scss', './dialog.scss']
})
export class PreferenceDialogComponent  {

  constructor(public dialogRef: MatDialogRef<PreferenceDialogComponent>, private dialog: MatDialog,
    private authService: AuthService, private accountService: AccountService) {}

  saveState: SaveState = SaveState.untouched;
  SaveState = SaveState;
  saving = false;

  preference: UserPreference= {
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

  trySave() {
    this.saveState = SaveState.touched;
  }

  onSaveStateChange(state: SaveState) {
    this.saveState = state;
    if (state === SaveState.confirmed) {
      this.confirm();
    }

  }

  change() {
    this.saveState = SaveState.untouched;
  }

  confirm() {
    this.saving = true;
    this.accountService.savePreference(this.preference).subscribe(() => {
      this.authService.updateCachedPreference(this.preference);
      this.saveState = SaveState.saved;
      this.saving = false;
     });
  }

  close() {
    this.dialogRef.close(this.preference);
  }

}
