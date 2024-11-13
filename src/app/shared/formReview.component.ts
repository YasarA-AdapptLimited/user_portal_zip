import { Component, Input, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { LogService } from '../core/service/log.service';

@Component({
  selector: 'app-form-review',
  moduleId: module.id,
  templateUrl: './formReview.component.html',
  styleUrls: ['./formReview.scss']
})
export class FormReviewComponent implements OnInit  {
  @Input() editWidth = 8;
  @Input() spread = false;

  readWidth = 5;


  ngOnInit() {
    this.readWidth = 12 - this.editWidth;
  }



}
