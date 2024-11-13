import { Component, Input, Output, EventEmitter, OnInit, ViewChildren } from '@angular/core';
import { Address } from './model/Address';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AccountService } from './service/account.service';
import { AuthService } from '../core/service/auth.service';
import { LogService } from '../core/service/log.service';
import { debounceTime } from 'rxjs/operators';

interface AddressSearch {
  countryCode?: string;
  postcode?: string;
  results?: any;
}

@Component({
  selector: 'app-address-search',
  moduleId: module.id,
  templateUrl: './addressSearch.component.html',
  styleUrls: ['./addressSearch.scss']
})
export class AddressSearchComponent implements OnInit {

  @ViewChildren('focus') vc;
  countries = [];
  search: AddressSearch = {
    countryCode: 'GB'
  };

  @Input() set editing(editing) {
    if (this.postcode) {
      this.postcode.markAsUntouched();
    }

    if (editing) {
      this.setFocus();
    }
  }
  @Output() selected = new EventEmitter<Address>();
  @Output() manualInput = new EventEmitter();

  searching = false;
  addressForm: FormGroup;

  isUK = true;

  constructor(private service: AccountService, private log: LogService, private auth: AuthService) { }

  get postcode() {
    return this.addressForm && this.addressForm.get('postcode');
  }
  get countryCode() {
    return this.addressForm && this.addressForm.get('countryCode');
  }

  ngOnInit() {
    /* tslint:disable: max-line-length*/
    const ukPostcodePattern = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})/g;

    this.addressForm = new FormGroup(
      {
        countryCode: new FormControl<string | null>(this.search.countryCode),
        postcode: new FormControl<string | null>(this.search.postcode, [Validators.required, Validators.pattern(ukPostcodePattern)])
      }
    );

    // debounce keystroke events
    this.postcode.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(newValue => this.searchAddress());

    this.countryCode.valueChanges
      .subscribe(newValue => {
 
        if (newValue === 'GB') {
          this.addressForm.controls['postcode'].setValidators([Validators.required, Validators.pattern(ukPostcodePattern)]);
        } else {
          this.addressForm.controls['postcode'].setValidators([Validators.required]);
        }
        this.addressForm.controls['postcode'].setValue('');
        this.addressForm.controls['postcode'].markAsUntouched();
      });

    this.getCountries();

  }

  setFocus() {
    setTimeout(function () {
      if (this.vc.first) {
        this.vc.first.nativeElement.focus();
      }
    }.bind(this), 100);
  }

  getCountries() {
    if (!this.countries.length) {
      this.service.getCountries().subscribe(data => {
        this.countries = data;
      });
    }
  }

  enableManualInput() {
    this.manualInput.emit();
  }

  searchAddress() {
    this.postcode.markAsTouched();
    if (this.countryCode.value && this.postcode.valid) {
      this.searching = true;
      this.service.searchAddress(this.countryCode.value, this.postcode.value).subscribe(results => {
        this.search.results = results.filter(result => result.type === 'Address');
        this.searching = false;
      });
    }
  }

  select(id) {
    this.service.getAddress(id).subscribe(address => {
      this.selected.emit(address);
    });
  }
}
