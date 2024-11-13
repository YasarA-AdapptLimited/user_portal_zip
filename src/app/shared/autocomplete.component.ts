import { Component, Input, OnInit, Output, EventEmitter, forwardRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';



@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ]
})
export class AutocompleteComponent implements OnInit, ControlValueAccessor {

  myControl: FormControl<string | null> = new FormControl();
  @Input() options;
  @Input() name;
  @Input() id;
  @Input() class;
  @Input() placeholder;
  value = '';

  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(null),
        map(val => val ? this.filter(val) : this.options.slice())
      );
    this.myControl.setValue(this.value);
  }

  filter(val: string): string[] {
    return this.options.filter(
      option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  trySelect() {

    const filter = this.options.filter(option => option.toLowerCase() === this.myControl.value.toLowerCase());

    if (filter.length) {
      this.value = filter[0];
      this.propagate();
    }
  }

  onOptionSelected($event) {
    this.value = this.options.filter(option => option === $event.option.value)[0];
    this.propagate();
  }

  propagate() {
    this.propagateChange(this.myControl.value);
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
      this.myControl.setValue(this.value);
    }
  }
  propagateChange = (model: any) => {};
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() {}


}
