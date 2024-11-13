import { Component, Input, OnInit } from '@angular/core';
import { CpdEntry } from '../model/review/CpdEntry';
import { AnswerType } from '../../dynamic/model/AnswerType';
import { revalidationItemTypes } from '../model/revalidation/revalidationItemTypes';
import { RevalidationItemTypeConfig } from '../model/revalidation/RevalidationItemTypeConfig';

@Component({
  selector: 'app-cpd-entry',
  moduleId: module.id,
  templateUrl: './cpdEntry.component.html',
  styleUrls: ['./cpdEntry.scss']
})
export class CpdEntryComponent implements OnInit {

  @Input() cpdEntry: CpdEntry;
  @Input() typeVisible = true;
  @Input() annotationsVisible = false;

  type: RevalidationItemTypeConfig;

  ngOnInit() {
    this.type = revalidationItemTypes.filter(t => t.type === this.cpdEntry.type)[0];
  }

}
