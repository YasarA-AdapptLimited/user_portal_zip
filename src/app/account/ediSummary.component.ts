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
  selector: 'app-edi-summary',
  moduleId: module.id,
  templateUrl: './ediSummary.component.html'
})
export class EdiSummaryComponent implements OnInit {

  @Input() edi: EqualityDiversity;
  summary;
  constructor(public service: EdiService) { }
  loading = false;
  ngOnInit() {
    this.loading = true;
    this.service.getSummary(this.edi).subscribe(summary => {
      this.summary = summary;
      this.loading = false;
    });
  }

}
