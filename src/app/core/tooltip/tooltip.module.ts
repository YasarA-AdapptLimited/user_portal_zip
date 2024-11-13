import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipService } from './tooltip.service';
import { TooltipDirective } from './tooltip.directive';
import { TooltipContextDirective } from './tooltipContext.directive';
import { TooltipComponent } from './tooltip.component';
import { TooltipContainerComponent } from './tooltipContainer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TooltipDirective,
    TooltipContainerComponent,
    TooltipComponent,
    TooltipContextDirective
  ],
  exports: [
    TooltipDirective,
    TooltipContainerComponent,
    TooltipComponent,
    TooltipContextDirective
  ]
})
export class TooltipModule { }
