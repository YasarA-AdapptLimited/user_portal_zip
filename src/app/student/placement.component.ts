import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Placement } from '../shared/model/student/Placement';
import { RegisterSearchResult } from '../registration/model/RegisterSearchParams';
import { Premise } from '../shared/model/student/Premise';
import { Tutor } from '../shared/model/student/Tutor';


@Component({
  selector: 'app-placement',
  moduleId: module.id,
  templateUrl: './placement.component.html',
  styleUrls: ['./placement.scss']
})
export class PlacementComponent implements OnInit {

  @Input() readonly = false;
  @Input() touched = false;
  @Input() placement: Placement;
  @Input() index;
  @Output() changed = new EventEmitter();
  showDetailsHelp;
  duplicateTutor = false;
  ngOnInit() {
    this.placement.updated$.subscribe((field) => {
      this.changed.emit(field);
    });

  }
  clearTrainingSiteMetadata() {
    if (this.placement.trainingSite) {
      this.placement.trainingSite.isOwner = undefined;
      this.placement.trainingSite.isRelated = undefined;
    }
  }

  validateTutor(tutor, index) {
    if (!tutor) {
      return false;
    }

    if (index === 0) {
      this.placement.updateTutor(tutor, index);
    } else {
      if (tutor.gphcId === this.placement.tutors[0].gphcId) {
        this.duplicateTutor = true;
        this.changed.emit('duplicate');
      } else {
        this.duplicateTutor = false;
        this.placement.updateTutor(tutor, index);
      }
    }

  }


  constructor() { }
}
