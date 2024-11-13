import { Component } from '@angular/core';
import { TooltipService } from './tooltip.service';

@Component({
  selector: 'app-tooltip-container',
  moduleId: module.id,
  templateUrl: './tooltipContainer.component.html',
  styleUrls: ['./tooltipContainer.scss']
})
export class TooltipContainerComponent {

  constructor(public service: TooltipService) { }

  showSoloTip() {
    return !!this.service.soloTip;
  }

}
