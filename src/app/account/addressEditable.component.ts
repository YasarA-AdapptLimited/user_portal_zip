import { Component, Input, OnInit, ViewChildren, ElementRef, AfterViewInit} from '@angular/core';
import { Address } from './model/Address';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { AccountService } from './service/account.service';
import { AuthService } from '../core/service/auth.service';
import { LogService } from '../core/service/log.service';
import { inputValidator, UK } from '../shared/user-address/userAddress';






@Component({
  selector: 'app-address-editable',
  moduleId: module.id,
  templateUrl: './addressEditable.component.html',
  styleUrls: ['./addressEditable.scss']
})
export class AddressEditableComponent {
  @Input() address: Address;
  selectedAddress = false;
  manualInput = false;
  editingAddress: Address;
  countries = [];
  @Input() creating = false;
  editing = false;
  saving = false;
  searching = false;
  confirmed = false;
  townChanged = false;

  constructor(private service: AccountService, private log: LogService, private auth: AuthService) { }


  cancel() {
    if (this.selectedAddress) {
      this.selectedAddress = undefined;
    } else {
      this.editing = false;
    }
  }

  get valid() {
    if(!this.editingAddress) {
      return;
    }
    let isValid = !!(this.editingAddress) &&
    (!!(this.editingAddress.line1) && inputValidator(this.editingAddress.line1)) &&
    (!!(this.editingAddress.town) && inputValidator(this.editingAddress.town)) &&
    !!(this.editingAddress.country);

    if(this.editingAddress.line2) {
      isValid = isValid && inputValidator(this.editingAddress.line2);
    }

    if(this.editingAddress.line3) {
      isValid = isValid && inputValidator(this.editingAddress.line3);
    }

    if(this.editingAddress.postcode) {
      isValid = isValid && inputValidator(this.editingAddress.postcode);
    }

    if(this.editingAddress.county) {
      isValid = isValid && inputValidator(this.editingAddress.county);
    }

    if((this.editingAddress?.country !== UK) ||
        (this.editingAddress?.country === UK &&
        this.editingAddress?.homeNation &&
        this.editingAddress?.latitude &&
        this.editingAddress?.longitude) ) {
      return isValid;
    }
    return isValid && this.editingAddress.homeNation;
  }

  enableManualInput() {
    this.manualInput = true;
    this.selectedAddress = false;
    this.editingAddress = new Address();
  }

  addressSelected(address) {
    this.selectedAddress = true;
    this.manualInput = false;
    this.editingAddress = address;
  }

  onEdit() {
    this.editing = true;
  }

  save() {
      this.saving = true;
      this.service.saveAddress(this.editingAddress)
      .subscribe(result => {
        this.townChanged = this.editingAddress.town !== this.address.town;
        this.address = this.editingAddress;
        this.auth.updateCachedAddress(this.address);
        this.selectedAddress = false;
        this.manualInput = false;
        this.editing = false;
        this.saving = false;
      }, error => {
          //console.log(error);
      });
  }

}
