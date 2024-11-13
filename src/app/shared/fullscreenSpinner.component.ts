import { Component, Input } from '@angular/core';
import { LayoutService } from '../core/service/layout.service';

@Component({
  selector: 'app-fullscreen-spinner',
  template: `<div class="wrapper" *ngIf="visible">
  <div class="spinner-container">
      <div *ngIf="!layout.state.xs" class="foreground text-center spinner large">
        <app-spinner diameter="150" >{{ text }}</app-spinner>
      </div>
      <div *ngIf="layout.state.xs" class="foreground text-center spinner">
        <app-spinner diameter="120" >{{ text }}</app-spinner>
      </div>
  </div>
</div>`,
  styleUrls: ['fullscreenSpinner.scss']
})
export class FullscreenSpinnerComponent {

  constructor(public layout: LayoutService) {

    layout.state$.subscribe(layoutState => {
      this.visible = layoutState.fullscreenSpinner.visible;
      this.text = layoutState.fullscreenSpinner.text;
    });
  }
  visible = false;
  text = 'Saving';


}
