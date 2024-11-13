import { Component, Input, Output, EventEmitter, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Contact } from './model/Contact';
import { AccountService } from './service/account.service';
import { AuthService } from '../core/service/auth.service';
import { UserPreference } from './model/UserPreference';
import { CommsPreference } from './model/CommsPreference';
import { User } from './model/User';
import { SaveState } from './model/SaveState';

enum Warning {
  None,
  Three,
  Four,
  Five,
  Six,
  Seven
}

@Component({
  selector: 'app-comms-preferences',
  moduleId: module.id,
  templateUrl: './commsPreferences.component.html'
})
export class CommsPreferencesComponent  {


  Warning = Warning;
  warning: Warning = Warning.None;
  combinations = [
    // essential email, essentail text, important email, important text
    [true, true, true, true, Warning.None],
    [true, true, true, false, Warning.None],
    [true, true, false, true, Warning.None],
    [true, true, false, false, Warning.Five],
    [true, false, false, false, Warning.Six],
    [false, true, false, false, Warning.Six],
    [false, false, false, false, Warning.Seven],
    [true, false, true, false, Warning.Four],
    [true, false, false, true, Warning.Four],
    [false, true, true, false, Warning.Four],
    [false, true, true, true, Warning.Four],
    [false, true, false, true, Warning.Four],
    [false, false, true, false, Warning.Three],
    [false, false, false, true, Warning.Three],
    [false, false, true, true, Warning.Three],
    [true, false, true, true, Warning.Four]
  ];
  user: User;

  constructor(private service: AccountService, public auth: AuthService) {
    this.user = this.auth.user;
  }

  @Input() comms: CommsPreference;
  @Input() showWarnings = true;
  @Output() saveStateChange = new EventEmitter<SaveState>(true);

  SaveState = SaveState;
  saveState: SaveState = SaveState.untouched;
  @Input('saveState') set setState(state: SaveState) {
    if (state === this.saveState) { return; }
    this.saveState = state;
    if (state === SaveState.touched) {
      this.validate();
    }
  }

  get requireMobile() {
    return this.comms && (this.comms.essentialTexts || this.comms.importantTexts)
      && !this.user.contact.mobilePhone;
  }

  validate() {
    this.warning = <Warning>this.combinations.filter(item =>
      this.comms.essentialEmails === item[0] &&
      this.comms.essentialTexts === item[1] &&
      this.comms.importantEmails === item[2] &&
      this.comms.importantTexts === item[3]
    )[0][4];

    this.saveState = this.warning === Warning.None ? SaveState.confirmed : SaveState.confirmationRequired;
    this.saveStateChange.emit(this.saveState);
  }

}
