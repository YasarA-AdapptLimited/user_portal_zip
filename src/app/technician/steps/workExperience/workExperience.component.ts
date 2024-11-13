import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { WorkExperience } from '../../model/WorkExperience';


@Component({
  selector: 'app-work-experience',
  moduleId: module.id,
  templateUrl: './workExperience.component.html',
  styleUrls: ['./workExperience.scss']
})
export class WorkExperienceComponent implements OnInit {

  @Input() readonly = false;
  @Input() touched = false;
  @Input() workExperience: WorkExperience;
  @Input() index;
  @Output() changed = new EventEmitter();
  today = new Date();
	public ExtendedDate: number = 30;
  constructor() { }

  ngOnInit() {
    this.workExperience.updated$.subscribe((field) => {
      this.changed.emit(field);
    });
    this.today.setDate(this.today.getDate() + this.ExtendedDate);
  }

}
