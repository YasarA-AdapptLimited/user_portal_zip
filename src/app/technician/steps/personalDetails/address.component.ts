import { Component, Input, AfterViewInit, ViewChildren, forwardRef, OnInit, ViewChild } from '@angular/core';
import { Address } from '../../../account/model/Address';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, ControlContainer, NgForm } from '@angular/forms';
import { AccountService } from '../../../account/service/account.service';
import { CountriesOfUK, getCountryName, HomeNationTypes, UK } from '../../../shared/user-address/userAddress';
import { Tooltip } from '../../../core/tooltip/Tooltip';

@Component({
  selector: 'app-address-technician',
  moduleId: module.id,
  templateUrl: './address.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressComponent),
      multi: true
    }
  ]
})
export class AddressComponent implements ControlValueAccessor, OnInit  {
  address: Address = new Address();
  @ViewChildren('focus') vc;
  @ViewChild('form') form: NgForm;
  @Input() touched = false;
  @Input('address') set setAddress(value) {
    this.address = value || {};
  }
  manualInput = false;
  @Input('manualInput') set setManualInput(manualInput) {
    this.manualInput = manualInput;
  }
  @Input() lineOneEditable = false;
  @Input() set lineOneFocussed(value) {
    if (value) {
      this.setFocus();
    }
  }
  countries = [];

  UKcountries = CountriesOfUK;
  countryChange = false;
  currentAddress;
  uk_fullForm = UK;

  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };

  constructor(private service: AccountService) {}

  ngOnInit() {
    this.getCountries();
  }

  getCountries() {
    if (!this.countries.length) {
      this.service.getCountries().subscribe(data => {
        this.countries = data;
      });
    }
  }

  setFocus() {
    setTimeout(function () {
      if (this.vc.first && this.vc.first.nativeElement) {
        this.vc.first.nativeElement.focus();
      }
    }.bind(this), 300);
  }


  propagate() {
    if (this.form.valid) {
      this.propagateChange(this.address);
    }
    this.checkIfAddressWasChanged(this.address);
  }

  get valid() {
    return this.form && this.form.valid;
  }

  writeValue(value: any) {
    if (value) {
      
      const emptyObj = {};
      this.currentAddress = Object.assign(emptyObj, this.address);

      this.address = value;
    }
  }
  propagateChange = (model: any) => { };
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() { }

  onCountryChange() {
    if(this.address?.country === this.uk_fullForm) {
      this.address.homeNation = null;
    } else {
      this.address.homeNation = HomeNationTypes.Other;
    }
    this.address.latitude = null;
    this.address.longitude = null;
  }

  residentCountry() {
      return getCountryName(this.address.homeNation);
  }

  checkIfAddressWasChanged(updateAddress) {
    if(this.currentAddress !==undefined && this.currentAddress) {
      if(JSON.stringify(this.currentAddress) !== JSON.stringify(updateAddress) ) {
        this.erasePreviousDetails();
      }
    }
  }

  erasePreviousDetails() {
    if(this.address?.countryCode) {
      this.address.countryCode = null;
    }
    if(this.address?.id) {
      this.address.id = null;
    }
    this.address.latitude = null;
    this.address.longitude = null;
  }
}
