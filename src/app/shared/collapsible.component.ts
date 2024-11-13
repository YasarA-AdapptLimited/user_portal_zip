import { Component, Input, Output, EventEmitter} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-collapsible',
  moduleId: module.id,
  templateUrl: 'collapsible.component.html',
  styleUrls: ['./collapsible.scss'],
  animations: [
    trigger('openState', [
      state('open', style({
        height: '*',
        opacity: '1',
       // display: 'block'
       visibility: 'visible'
      })),
      state('closed', style({
        height: '0',
        opacity: '0',
       // display: 'none'
       visibility: 'hidden'
      })),
      transition('open => closed', animate('250ms cubic-bezier(0, 0, 0.2, 1)')),
      transition('closed => open', animate('250ms cubic-bezier(0, 0, 0.2, 1)'))
    ])
  ]
})
export class CollapsibleComponent  {

  openState = 'closed';
  @Input() overlay = false; // not currently implemented
  open = false;
  @Input() set trigger(value) {
    if (value === undefined) { return; }
    this.openState = value ? 'open' : 'closed';
    if (!value) {
      setTimeout(() => {
        this.open = value;
      }, 300);
    } else {
      this.open = value;
    }

  }


}
