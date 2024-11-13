import { ElementRef } from '@angular/core';

export interface Tooltip {
  id: string;
  source?: ElementRef;
  visible?: boolean;
  content: string;
  contextId?: string;
  placement?: any;
  order: number;
  width?: number;
  notSolo?: boolean;
  used?: boolean;
  isHidden?(): boolean;
}
