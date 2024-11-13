import { Component, Input, ViewChildren, QueryList, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { PremisesSearchBy, PremisesSearchParams, PremisesSearchResult } from '../../../registration/model/PremisesSearchParams';
import { RegistrationService } from '../../../core/service/registration.service';
import { Address } from '../../../account/model/Address';

@Component({
  selector: 'app-select-premises',
  moduleId: module.id,
  templateUrl: './selectPremises.component.html',
  styleUrls: ['./selectPremises.component.scss']
})
export class SelectPremisesComponent {

  @Input() readonly = false;
  @Input() touched = false;

  searched = false;
  @Input() title = 'pharmacy premises';
  @Input() item: PremisesSearchResult;
  @Output() selected = new EventEmitter();

  PremisesSearchBy = PremisesSearchBy;

  searchParams: PremisesSearchParams = new PremisesSearchParams();
  results: Array<PremisesSearchResult>;

  premiseSaved = false;
  searching = false;
  loadingMore = false;
  showLoadMore = false;
  noResultsVisible = false;

  unregisteredPremiseSearchModel: {
    name: string,
    address: Address
  } = {
    name: null,
    address: null
  }

  @ViewChildren('focus') focus: QueryList<any>;

  constructor(private regService: RegistrationService) { }

  get searchParamsValid() {
    if (this.searchParams.searchBy === PremisesSearchBy.Number && !this.searchParams.regNumber) {
      return false;
    }
    if (this.searchParams.searchBy === PremisesSearchBy.Postcode && !this.searchParams.postcode) {
      return false;
    }
    return true;
  }

  search() {
    this.searched = true;
    if (!this.searchParamsValid) {
      return;
    }
    this.searchParams.skip = 0;
    this.searching = true;
    this.regService.searchPremises(this.searchParams)
      .subscribe(results => {
        this.results = results;
        this.searching = false;
        this.showLoadMore = results.length === this.searchParams.take;
        this.noResultsVisible = results.length === 0;
      }, error => {
        this.searching = false;
        this.showLoadMore = false;
      });
  }

  update() {
    const hasUnregisteredPremiseName = !!this.unregisteredPremiseSearchModel.name;
    const hasUnregisteredAddress = !!this.unregisteredPremiseSearchModel.address;
    if (hasUnregisteredPremiseName && hasUnregisteredAddress) {
      this.selected.emit(this.unregisteredPremiseSearchModel);
    }
  }


  get searchByPostcode() {
    return this.searchParams.searchBy === PremisesSearchBy.Postcode;
  }
  get searchByNumber() {
    return this.searchParams.searchBy === PremisesSearchBy.Number;
  }

  get searchByNotOnRegister() {
    return this.searchParams.searchBy === PremisesSearchBy.NotOnRegister;
  }


  setFocus() {
    if (this.results) {
      this.results.length = 0;
    }
    setTimeout(function () {
      if (this.focus.first && this.focus.first.nativeElement) {
        this.focus.first.nativeElement.focus();
      }
    }.bind(this), 50);
  }


  setSelected(item) {
    // if (item.eligibleAsTrainingSite) {
      this.item = item;
      this.selected.emit(item);
    // }
  }

  ineligibleTooltip(item) {
    if (item.eligibleAsTrainingSite) {
      return false;
    }

    return {
      id: 'ineligible',
      content: 'This premises is not eligible as a training site.',
      width: 290,
      placement: 'top',
      order: -1
    };

  }

  render(item) {
    if (!item) { return ''; }
    /*
     "id": "5dd68bc4-44b0-e411-80d8-00505685383b",
                "registrationNumber": "1031799",
                "name": "H.J. Everett (Chemist) Ltd.",
                "owner": "H J Everett (Chemist) Ltd",
                "address": {
                    "line1": "58-60 High Street",
                    "line2": "Cosham",
                    "line3": null,
                    "town": "PORTSMOUTH",
                    "county": "Hampshire",
                    "postcode": "PO6 3AG",
                    "country": "UK",
                    "countryCode": null
                },
                   "expiryDate": "2018-12-31T00:00:00",
                "accreditedTo": "2020-11-30T00:00:00",
                "eligibleAsTrainingSite": true
    */
  
    const newAdd = new Address(item.address);
    return `${item.name}, ${newAdd.toString()}`;
  }

  clearNoResults() {
    this.noResultsVisible = false;
  }

  loadMore() {
    this.searchParams.skip += this.searchParams.take;
    this.loadingMore = true;
    this.regService.searchPremises(this.searchParams)
      .subscribe(results => {
        this.showLoadMore = results.length === this.searchParams.take;
        this.results = this.results.concat(results);
        this.loadingMore = false;
      }, error => {
        this.loadingMore = false;
      });
  }

  cancelSelection() {
    this.item = undefined;
    this.selected.emit(undefined);
    this.searched = false;

  }



}
