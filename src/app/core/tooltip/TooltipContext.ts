import { ElementRef } from '@angular/core';
import { Tooltip } from './Tooltip';

export interface TooltipContext {
  id: string;
  source: ElementRef;
  tooltips: Array<Tooltip>;
  active: boolean;
}
