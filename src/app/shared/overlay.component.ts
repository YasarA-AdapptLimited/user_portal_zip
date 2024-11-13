import { Component, Input, Output, EventEmitter} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { LayoutService } from '../core/service/layout.service';

@Component({
  selector: 'app-overlay',
  moduleId: module.id,
  templateUrl: 'overlay.component.html',
  styleUrls: ['./overlay.scss'],
  animations: [
    trigger('overlayState', [
      state('visible', style({
        opacity: '1',
        display: 'block'
      })),
      state('hidden', style({
        opacity: '0',
        display: 'none'
      })),
      transition('visible => hidden', animate('250ms cubic-bezier(0, 0, 0.2, 1)')),
      transition('hidden => visible', animate('250ms cubic-bezier(0, 0, 0.2, 1)'))
    ])
  ]
})
export class OverlayComponent  {

  constructor(private layout: LayoutService) {

    layout.state$.subscribe(layoutState => {
      this.overlayState = layoutState.overlay ? 'visible' : 'hidden';
    });

  }

  overlayState = 'hidden';


  /*<div *ngIf="layout.state.overlay || layout.state.overlayFadeout || log.notifyIsOffline || log.notifyLoggedOut" class="overlay"
[class.fadein]="layout.state.overlay && !layout.state.overlayFadeout"
[class.fadeout]="layout.state.overlayFadeout"
></div>
*/

}
