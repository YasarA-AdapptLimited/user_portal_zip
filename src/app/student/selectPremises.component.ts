import { Component, Input, ViewChildren, QueryList, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { PremisesSearchBy, PremisesSearchParams, PremisesSearchResult } from '../registration/model/PremisesSearchParams';
import { RegistrationService } from '../core/service/registration.service';

@Component({
  selector: 'app-select-premises',
  moduleId: module.id,
  templateUrl: './selectPremises.component.html',
  styles: [`.results { max-height: 200px; overflow-y: auto}
  tr.ineligible { background: #f5f5f5; color: #b7b7b7; }
  `]
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

  searching = false;
  loadingMore = false;
  showLoadMore = false;
  noResultsVisible = false;

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


  get searchByPostcode() {
    return this.searchParams.searchBy === PremisesSearchBy.Postcode;
  }
  get searchByNumber() {
    return this.searchParams.searchBy === PremisesSearchBy.Number;
  }


  setFocus() {
    setTimeout(function () {
      if (this.focus.first && this.focus.first.nativeElement) {
        this.focus.first.nativeElement.focus();
      }
    }.bind(this), 50);
  }


  setSelected(item) {
    if (item.eligibleAsTrainingSite) {
      this.item = item;
      this.selected.emit(item);
    }
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
    return item.name + ', ' + item.address.town;
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
