import { Component, Input, OnInit, forwardRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Address } from '../../../account/model/Address';
import { AddressComponent } from './address.component';

@Component({
  selector: 'app-address-edit-technician',
  moduleId: module.id,
  templateUrl: './addressEdit.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressEditComponent),
      multi: true
    }
  ]
})
export class AddressEditComponent {
  address: Address;
  @Input() manualInput = false;
  editing = false;
  lineOneFocussed = false;
  @Input() touched = false;
  @ViewChild('addressedit') addressedit: AddressComponent;

  reselect() {
    this.address = undefined;
    if (this.addressedit.valid) {
      this.propagateChange(this.address);
    }
    this.manualInput = false;
    this.editing = true;
    this.lineOneFocussed = false;
  }

  enableManualInput() {
    this.manualInput = true;
    this.lineOneFocussed = true;
  }

  writeValue(value: any) {
    if (value) {
      this.address = value;
    }
  }
  propagateChange = (model: any) => { };
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() { }

  onSelect(address) {
    this.address = address;
    this.lineOneFocussed = true;
    if (this.addressedit.valid) {
      this.propagateChange(address);
    }
  }

  update() {

  }

}
