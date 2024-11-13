import { Component, Input, forwardRef,
   ViewChild, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';


import { LayoutService } from '../core/service/layout.service';
import utils from './service/utils';

@Component({
  selector: 'app-utc-date-picker',
  templateUrl: './utcDatePicker.component.html',
  styleUrls: ['./utcDatePicker.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UtcDatePickerComponent),
      multi: true
    }
  ]
})
export class UtcDatePickerComponent implements ControlValueAccessor {

  constructor(private cd: ChangeDetectorRef, public layout: LayoutService) { }
  
  @ViewChild('picker') datePicker : MatDatepicker<any>;
  dateValue: Date;
  @Input() whiteBackground = false;
  @Input() readonly = false;
  @Input() name = 'date';
  @Input() error = false;
  @Input() min;
  @Input() max;
  @Input() width = '200px';
  @Input() question;
  isExtendUntilQuestionId = false;

  setDateToUndefined() {
    this.datePicker.select(undefined);
  }

  dateChange(date) {
    const adjustedDateString = utils.formatDate(date);
    this.propagateChange(adjustedDateString);
  }

  writeValue(value: any) {
    if (value) {
      if (!(value instanceof Date)) {
        value = new Date(value.split('T')[0]);
      }
      this.dateValue = value;
      this.cd.detectChanges();
    }
  }
  propagateChange = (model: any) => {};
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() {}


  onClose() {
    // Datepicker in EC request form(Extend until date), requires triggering of validity check on close of datepicker.
    this.isExtendUntilQuestionId = this.name === '2cea08a3-46bf-47e4-94b5-fdb590854da6' ? true: false;
    if(this.isExtendUntilQuestionId) {
      this.propagateChange(utils.formatDate(this.dateValue));
    }    
  }
}
