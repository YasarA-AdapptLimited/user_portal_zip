import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { min, max } from 'rxjs/operators';

@Component({
  selector: 'app-daterange',
  moduleId: module.id,
  templateUrl: 'daterange.component.html',
  styleUrls: ['./daterange.scss']
})
export class DaterangeComponent implements OnInit  {


  @Input() fromDate: string;
  @Input() fromMin: Date;
  @Input() fromMax: Date;
  @Input() overlapError = false;
  @Input() overlapErrorMessage;
  @Input() toDate: string;
  @Input() toMin: Date;
  @Input() toMax: Date;
  @Input() readonly = false;
  @Input() touched;
  @Output() changed = new EventEmitter<{from: string, to: string}>();
  @Input() width = '200px';
  @Input() endDateTitle = 'End date';
  errorMessages = [];
  valid = true;

  @Input() fromDateTooEarlyMessage;
  @Input() toDateTooEarlyMessage;
  @Input() fromDateTooLateMessage;
  @Input() toDateTooLateMessage;
  @Input() isPastDateAllowed = true;
  ngOnInit() {
    this.validate();
  }

  validate() {

    this.errorMessages = [];

    if (!this.fromDate || !this.toDate) {
      return;
    }
    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);
    
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);
    if (from > to) {
      this.errorMessages.push('Invalid date range - end date must be after start date');
    }
    if (this.fromMin !== undefined && from < this.fromMin) {
      this.errorMessages.push(this.fromDateTooEarlyMessage || 'Start date is too early');
    }
    if (this.fromMax !== undefined && from > this.fromMax) {
      this.errorMessages.push(this.fromDateTooLateMessage || 'Start date is too late');
    }
    if (this.toMin !== undefined && to < this.fromMin) {
      this.errorMessages.push(this.toDateTooEarlyMessage || 'End date is too early');
    }
    if (this.toMin !== undefined && to < this.fromMin) {
      this.errorMessages.push(this.toDateTooLateMessage || 'End date is too late');
    }
    if(!this.isPastDateAllowed)
    {
      if(from < todayDate)
      {
        this.errorMessages.push('Start date cannot be in the past');
      }
    }

    this.changed.emit({from: this.fromDate, to: this.toDate });

    this.valid = !this.errorMessages.length;

  }

 

}
