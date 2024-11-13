import { Component, OnInit, ErrorHandler, Input, ViewChild, ViewChildren, ElementRef, QueryList, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { LogService } from '../core/service/log.service';
import { User } from './model/User';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from './service/account.service';
import { EqualityDiversity } from './model/EqualityDiversity';
import { EqualityDiversityOptions } from './model/EqualityDiversityOptions';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { EdiService } from './service/edi.service';

@Component({
  selector: 'app-edi',
  moduleId: module.id,
  templateUrl: './edi.component.html',
  styleUrls: ['./edi.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EdiComponent),
      multi: true
    }
  ]
})
export class EdiComponent implements OnInit, ControlValueAccessor {

  selection;

  @ViewChild('ethnicityOtherInput') ethnicityOtherInput: ElementRef;
  @ViewChildren('otherInput') sectionOtherInputs: QueryList<ElementRef>;

  @Input() touched = false;
  @Input() valid: any = { };

  constructor(public service: EdiService) { }

  ngOnInit() {
    this.selection = this.service.notSelected();
  }
  writeValue(value: EqualityDiversity) {
    if (!value) { return; }
    this.selection = this.service.selectionFromModel(value);
  }

  ethnicitySelected(id) {
    if (this.service.isOtherEthnicity(id)) {
      setTimeout(() => {
        this.ethnicityOtherInput.nativeElement.focus();
      });
    }
    this.propagate();
  }

  sectionSelected(section, index, id) {
    if (this.service.isOtherSection(section, id)) {
      setTimeout(() => {
        // console.log(this.sectionOtherInputs.toArray());
        // this.sectionOtherInputs.toArray()[index].nativeElement.focus();
      });
    }
    this.propagate();
  }


  propagateChange = (model: EqualityDiversity) => { };
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() { }

  propagate() {
    const edi = this.service.selectionToModel(this.selection);
    this.propagateChange(edi);
  }


}
