import { Component, Input, ViewChildren, QueryList, ElementRef, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { RegisterSearchBy, RegisterSearchParams, RegisterSearchResult } from '../registration/model/RegisterSearchParams';
import { RegistrationService } from '../core/service/registration.service';
import { LearningContractResponse } from '../shared/model/student/LearningContractResponse';


@Component({
  selector: 'app-select-registrant',
  moduleId: module.id,
  templateUrl: './selectRegistrant.component.html',
  styles: [`.results { max-height: 200px; overflow-y: auto}
  tr.ineligible { background: #f5f5f5; color: #b7b7b7; }
  `]
})
export class SelectRegistrantComponent implements OnInit {

  constructor(private regService: RegistrationService) { }

  @Input() readonly = false;
  @Input() touched = false;
  @Input() item: RegisterSearchResult;
  @Output() selected = new EventEmitter();
  @Input() trainingPlacementStartDate;

  @Input() title = 'registrant';
  searched = false;

  RegisterSearchBy = RegisterSearchBy;

  searchParams: RegisterSearchParams = new RegisterSearchParams();
  results: Array<RegisterSearchResult>;

  searching = false;
  loadingMore = false;
  showLoadMore = false;
  noResultsVisible = false;
  LearningContractResponse = LearningContractResponse;

  @ViewChildren('focus') focus: QueryList<any>;
  @ViewChild('resultsList') resultsListRef: ElementRef;

  ngOnInit() {

  }

  get searchParamsValid() {
    if (this.searchParams.searchBy === RegisterSearchBy.Number && !this.searchParams.regNumber) {
      return false;
    }
    if (this.searchParams.searchBy === RegisterSearchBy.Name && !this.searchParams.lastName) {
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
    this.regService.searchRegister(this.searchParams)
      .subscribe(results => {
        this.calculateIfTutorIsEligible(results);
        this.results = results;
        this.searching = false;
        this.showLoadMore = results.length === this.searchParams.take;
        this.resultsListRef.nativeElement.scrollTop = 0;
        this.noResultsVisible = results.length === 0;
      }, error => {
        this.searching = false;
        this.showLoadMore = false;
      });
  }

  calculateIfTutorIsEligible(results) {
    const isEligible = (trainingPlacementStartDate, tutorRegistrationDate) => {
      return trainingPlacementStartDate > tutorRegistrationDate;
    };
    // generate fake data to test ineligible tutors
    // results.push({
    //   eligibleAsTutor: true,
    //   forenames: 'HeH1001181',
    //   gPhCId: '2f81631e-7aaf-e411-80e6-005056851bfe',
    //   initialRegistrationDate: '2020-07-17', // date set in the future for testing
    //   registrationNumber: '2050862',
    //   surname: 'TeH1001181',
    //   town: 'GoH1001181'
    // });

    results.forEach((value) => {
      const tutorRegDate = new Date(value.initialRegistrationDate);
      const trainingStartDate = new Date(this.trainingPlacementStartDate);
      // 33 months is 2 years and 9 months
      const tutorYear = tutorRegDate.getFullYear() + 2;
      const tutorMonth = tutorRegDate.getMonth() + 9;
      const tutorDay = tutorRegDate.getDate();
      const eligibleTutorDate = new Date(tutorYear, tutorMonth, tutorDay);
      value.eligibleAsTutor = isEligible(trainingStartDate, eligibleTutorDate);
    });
  }

  setSelected(item) {
    if (item.eligibleAsTutor) {
      this.item = item;
      this.selected.emit(item);
    }
  }

  get searchByName() {
    return this.searchParams.searchBy === RegisterSearchBy.Name;
  }
  get searchByNumber() {
    return this.searchParams.searchBy === RegisterSearchBy.Number;
  }

  clearNoResults() {
    this.noResultsVisible = false;
  }

  setFocus() {
    setTimeout(function () {
      if (this.focus.first && this.focus.first.nativeElement) {
        this.focus.first.nativeElement.focus();
      }
    }.bind(this), 50);
  }

  render(item) {
    if (!item) {
      return '';
    }
    let name = item.title ? item.title + ' ' : '';

    name += item.forenames + ' ' + item.surname;

    if (item.learningContractResponse) {
      name += ' (' + LearningContractResponse[item.learningContractResponse] + ')';
    }

    return name;

  }

  cancelSelection() {
    this.item = undefined;
    this.selected.emit(undefined);
    this.searched = false;
  }
}
