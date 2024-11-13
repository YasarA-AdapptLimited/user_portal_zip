import { Component, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";

@Component({
  moduleId: module.id,
  selector: "app-dob",
  templateUrl: "./dob.component.html"
})
export class DobComponent {
  @Output() selected = new EventEmitter<string>();
  yearSupplied = false;
  invalid = false;
  dob = {
    value: "",
    day: "",
    month: 0,
    year: ""
  };
  months = [
    { id: 0, name: "Month", days: 0 },
    { id: 1, name: "January", days: 31 },
    { id: 2, name: "February", days: 29 },
    { id: 3, name: "March", days: 31 },
    { id: 4, name: "April", days: 30 },
    { id: 5, name: "May", days: 31 },
    { id: 6, name: "June", days: 30 },
    { id: 7, name: "July", days: 31 },
    { id: 8, name: "August", days: 31 },
    { id: 9, name: "September", days: 30 },
    { id: 10, name: "October", days: 31 },
    { id: 11, name: "November", days: 30 },
    { id: 12, name: "December", days: 31 }
  ];

  isValid() {
    if (!this.dob.month) {
      return false;
    }
    if (!this.dob.day) {
      return false;
    }
    if (!this.dob.year) {
      return false;
    }

    const selectedMonth = this.months.filter(
      month => month.id === this.dob.month
    )[0];

    const day = parseInt(this.dob.day, 10);
    if (isNaN(day) || day < 1 || day > selectedMonth.days) {
      return false;
    }
    this.dob.day = day.toString();

    if (this.dob.year.length > 4) {
      return false;
    }
    const year = parseInt(this.dob.year, 10);
    if (isNaN(year) || year < 1900) {
      return false;
    }
    if (!this.IsUserEighteen()) {
      return false;
    }
    return true;
  }

  IsUserEighteen(): boolean {
    const dobMoment = moment(
      this.dob.year + "-" + this.dob.month + "-" + this.dob.day,
      "YYYY-MM-DD"
    );
    const monthDiff = moment(moment()).diff(dobMoment, "months", true);
    return monthDiff >= 216; // number of months in 18 yrs;
  }

  yearEntered() {
    this.yearSupplied = true;
    this.validate();
  }

  validateMonth($event){
    this.dob.month =this.months[$event].id;
    this.validate();
  }
  validate() {
    this.invalid = !this.isValid();
    if (this.invalid) {
      this.selected.emit(undefined);
    } else {
      this.dob.value = `${this.dob.year}-${this.dob.month}-${this.dob.day}`;
      this.selected.emit(this.dob.value);
    }
  }

  entered() {
    if (!this.dob.month) {
      return false;
    }
    if (!this.dob.day) {
      return false;
    }
    if (!this.yearSupplied) {
      return false;
    }
    return true;
  }
}
